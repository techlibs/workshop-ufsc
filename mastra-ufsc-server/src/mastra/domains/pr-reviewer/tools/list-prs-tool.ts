import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { githubService } from "../services/github-service";
import { prFormatter } from "../utils/pr-formatter";

export const listPRsTool = createTool({
  id: "list-pull-requests",
  description:
    "Lists pull requests from GitHub repository. Use this when user asks about open PRs, pending reviews, or wants to see PRs list.",

  inputSchema: z.object({
    state: z
      .enum(["open", "closed", "all"])
      .optional()
      .default("open")
      .describe("Filter by PR state"),
    includeDetails: z
      .boolean()
      .optional()
      .default(false)
      .describe("Include detailed information for each PR"),
  }),

  outputSchema: z.object({
    success: z.boolean(),
    count: z.number(),
    prs: z.array(z.any()),
    summary: z.string(),
    formatted: z.string().optional(),
  }),

  execute: async ({ context }) => {
    try {
      const prs = await githubService.listPullRequests({
        state: context.state,
      });

      let formatted = "";

      if (context.includeDetails) {
        formatted = prs.map((pr) => prFormatter.formatPRForList(pr)).join("\n\n");
      } else {
        formatted = prs.map((pr) => `#${pr.number}: ${pr.title}`).join("\n");
      }

      const summary = prFormatter.formatPRSummary(prs);

      return {
        success: true,
        count: prs.length,
        prs,
        summary,
        formatted,
      };
    } catch (error: any) {
      return {
        success: false,
        count: 0,
        prs: [],
        summary: `Error: ${error.message}`,
      };
    }
  },
});