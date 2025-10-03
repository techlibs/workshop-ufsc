import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { RequirementsStateSchema, FinalRequirementsOutputSchema } from "./types";
import { initializeState, updateRequirement, incrementTurn } from "./utils/state";
import { judgeRequirements } from "./agents/judge-agent";
import { interviewerAgent, buildInterviewPrompt } from "./agents/interviewer-agent";
import { ragStore } from "./utils/ragStore";

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

    // Otherwise craft next question (this is where we'd SUSPEND waiting for user answer)
    const prompt = buildInterviewPrompt(state);
    const resp = await interviewerAgent.generate([{ role: "user", content: prompt }]);

    // We store the question temporarily in a non-schema field (extend schema later if needed)
    (state as any).nextQuestion = resp.text.trim();
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
  id: "meta-agent-requirements-collector",
  description: "Collects and structures software/project requirements via multi-step agentic interview and light RAG context.",
  inputSchema: z.object({ query: z.string() }),
  outputSchema: FinalRequirementsOutputSchema,
})
  .then(initStep)
  // NOTE: Future: chain a dynamic loop with suspend/resume triggered externally.
  .then(finalizeStep);

metaAgentRequirementsCollectorWorkflow.commit();
