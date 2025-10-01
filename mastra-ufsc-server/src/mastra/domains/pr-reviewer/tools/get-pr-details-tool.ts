import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { githubService } from "../services/github-service";
import { prFormatter } from "../utils/pr-formatter";

export const getPRDetailsTool = createTool({
  id: "get-pr-details",
  description:
    "Gets detailed information about a specific pull request by number. Use when user asks about a specific PR like 'tell me about PR #123'.",

  inputSchema: z.object({
    prNumber: z.number().describe("The pull request number to get details for"),
  }),

  outputSchema: z.object({
    success: z.boolean(),
    pr: z.any().optional(),
    formatted: z.string().optional(),
    error: z.string().optional(),
  }),

  execute: async ({ context }) => {
    try {
      const pr = await githubService.getPullRequest(context.prNumber);

      const formatted = prFormatter.formatPRForDetails(pr);

      return {
        success: true,
        pr,
        formatted,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || `Failed to fetch PR #${context.prNumber}`,
      };
    }
  },
});