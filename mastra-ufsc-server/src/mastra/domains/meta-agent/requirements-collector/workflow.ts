import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { RequirementsStateSchema, FinalRequirementsOutputSchema } from './types';
import { initializeState, updateRequirement, incrementTurn } from './utils/state';
import { judgeRequirements } from './agents/judge-agent';
import { interviewerAgent, buildInterviewPrompt } from './agents/interviewer-agent';
import { ragStore } from './utils/ragStore';
import { metaAgentRagService } from './tools/websearch/meta-agent-rag-service';

// Step 1: Initialize from user query
const initStep = createStep({
  id: "meta-agent-init",
  description: "Initialize requirements collection state from original query.",
  inputSchema: z.object({ query: z.string() }),
  outputSchema: RequirementsStateSchema,
  execute: async ({ inputData }) => {
    return initializeState(inputData.query);
  },
});

// Step 1b: Ingest initial external context (web search + RAG). This seeds retrieval memory.
const ingestContextStep = createStep({
  id: 'meta-agent-ingest-context',
  description: 'Run web search ingestion for initial query and store chunks.',
  inputSchema: RequirementsStateSchema,
  outputSchema: RequirementsStateSchema,
  execute: async ({ inputData }) => {
    try {
      await metaAgentRagService.ingestFromQuery(inputData.originalQuery, { numResults: 5 });
    } catch (e) {
      // Non-fatal: proceed even if ingestion fails
      (inputData as any).ingestError = (e as Error).message;
    }
    return inputData;
  },
});

// Step 2: Interview loop (single iteration). In real suspend/resume we would pause after asking.
const interviewIterationStep = createStep({
  id: "meta-agent-interview-iteration",
  description: "One iteration: ask question or process user answer to fill requirements.",
  inputSchema: z.object({
    state: RequirementsStateSchema,
    latestUserMessage: z.string().optional(),
  }),
  outputSchema: RequirementsStateSchema,
  execute: async ({ inputData }) => {
    let state = inputData.state;

    // If there's a latest user message, judge and update
    if (inputData.latestUserMessage) {
      const judged = await judgeRequirements({ state, latestUserMessage: inputData.latestUserMessage });
      for (const j of judged) {
        if (j.value) {
          state = updateRequirement(state, j.id, { value: j.value, confidence: j.confidence });
        }
      }
      state = incrementTurn(state);
    }

    // If complete, return
    if (state.complete) return state;

    // Retrieve supporting context for next question drafting
    try {
      const contexts = await metaAgentRagService.retrieve(state.originalQuery, 4);
      (state as any).supportingContexts = contexts;
    } catch {/* ignore retrieval issues */}

    const prompt = buildInterviewPrompt(state) + '\n\nUse supporting context (if any) but do not quote excessively.';
    const resp = await interviewerAgent.generate([{ role: 'user', content: prompt }]);
    (state as any).nextQuestion = resp.text.trim();

    // --- Human-in-the-loop suspend placeholder ---
    // NOTE: When mastra workflow API exposes waitForEvent/suspend, replace return with suspend call:
    // return suspend({ event: 'meta-agent:user-response', payload: { question: state.nextQuestion } });
    return state;
  },
});

// Step 3: Final assembly
const finalizeStep = createStep({
  id: "meta-agent-finalize",
  description: "Produce final structured requirements output.",
  inputSchema: RequirementsStateSchema,
  outputSchema: FinalRequirementsOutputSchema,
  execute: async ({ inputData }) => {
    const ragSample = ragStore.search(inputData.originalQuery, 5);
    return {
      meta: {
        originalQuery: inputData.originalQuery,
        collectedAt: new Date().toISOString(),
        totalTurns: inputData.turns,
        version: "1.0.0",
      },
      requirements: inputData.requirements.map(r => ({
        id: r.id,
        label: r.label,
        value: r.value ?? null,
        normalized: r.normalized,
        confidence: r.confidence,
        sources: r.sources,
      })),
      contexts: {
        web: [],
        mastraDocs: [],
        ragSelected: ragSample,
      },
    };
  },
});

export const metaAgentRequirementsCollectorWorkflow = createWorkflow({
  id: 'meta-agent-requirements-collector',
  description: 'Collects and structures software/project requirements via multi-step agentic interview and light RAG context.',
  inputSchema: z.object({ query: z.string() }),
  outputSchema: FinalRequirementsOutputSchema,
})
  .then(initStep)
  .then(ingestContextStep)
  // TODO: Replace single finalize with loop controller once suspend/resume infra available.
  .then(finalizeStep);

metaAgentRequirementsCollectorWorkflow.commit();

// Temporary helper until framework exposes a standard .run API in this codebase context.
export async function runMetaAgentRequirementsCollector(params: { query: string }) {
  // Manually emulate the chained execution order.
  const state1 = await (initStep as any).execute({ inputData: { query: params.query } });
  const state2 = await (ingestContextStep as any).execute({ inputData: state1 });
  const final = await (finalizeStep as any).execute({ inputData: state2 });
  return final;
}
