import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { metaAgentRagService } from './websearch/meta-agent-rag-service';

// Tool wraps two phases: (a) ingest (search+fetch+index) when `ingest` true; (b) retrieve.
// This allows workflow to first expand context then pull topK at each interview turn.

export const metaAgentWebSearchTool = createTool({
  id: 'meta-agent-web-search',
  description: 'Meta-agent web search + RAG ingestion & retrieval (real providers via env).',
  inputSchema: z.object({
    query: z.string(),
    mode: z.enum(['ingest', 'retrieve']).default('retrieve'),
    numResults: z.number().min(1).max(15).optional(),
    topK: z.number().min(1).max(10).optional(),
  }),
  outputSchema: z.object({
    ingested: z.array(
      z.object({
        url: z.string(),
        chunkCount: z.number(),
        skipped: z.string().optional(),
      })
    ).optional(),
    contexts: z.array(
      z.object({ id: z.string(), url: z.string(), title: z.string().optional(), content: z.string(), score: z.number() })
    ).optional(),
  }),
  execute: async ({ context }) => {
    const { query, mode, numResults, topK } = context;
    if (mode === 'ingest') {
      const ingested = await metaAgentRagService.ingestFromQuery(query, { numResults });
      return { ingested };
    } else {
      const contexts = await metaAgentRagService.retrieve(query, topK || 5);
      return { contexts };
    }
  },
});
