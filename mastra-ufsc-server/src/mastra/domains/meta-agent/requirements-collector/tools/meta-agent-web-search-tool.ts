import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { PlaceholderSearchProvider } from "../utils/webSearch";

const provider = new PlaceholderSearchProvider();

export const metaAgentWebSearchTool = createTool({
  id: "meta-agent-web-search",
  description: "Performs a web search (placeholder implementation) and returns cleaned results.",
  inputSchema: z.object({
    query: z.string(),
    num: z.number().min(1).max(10).optional(),
  }),
  outputSchema: z.object({
    results: z.array(
      z.object({
        id: z.string(),
        url: z.string(),
        title: z.string(),
        snippet: z.string().optional(),
      })
    ),
  }),
  execute: async ({ context }) => {
    const { query, num } = context;
    const results = await provider.search(query, { num });
    return { results };
  },
});
