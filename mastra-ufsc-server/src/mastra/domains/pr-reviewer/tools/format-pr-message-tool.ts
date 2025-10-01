import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { githubService } from "../services/github-service";
import { prFormatter } from "../utils/pr-formatter";
import { messageTemplates } from "../utils/message-templates";

export const formatPRMessageTool = createTool({
  id: "format-pr-message",
  description:
    "Formats PR information into a WhatsApp-friendly message. Use before sending notifications.",

  inputSchema: z.object({
    prNumber: z.number().optional().describe("Specific PR number to format"),
    template: z
      .enum([
        "prOpened",
        "prReadyForReview",
        "reviewRequested",
        "prSummary",
        "dailyDigest",
      ])
      .optional()
      .describe("Message template to use"),
    includeDetails: z
      .boolean()
      .optional()
      .default(false)
      .describe("Include detailed PR information"),
    reviewer: z
      .string()
      .optional()
      .describe("Reviewer name for reviewRequested template"),
  }),

  outputSchema: z.object({
    success: z.boolean(),
    message: z.string().optional(),
    error: z.string().optional(),
  }),

  execute: async ({ context }) => {
    try {
      if (context.prNumber) {
        const pr = await githubService.getPullRequest(context.prNumber);

        let message: string;

        if (context.template) {
          switch (context.template) {
            case "prOpened":
              message = messageTemplates.prOpened(pr);
              break;
            case "prReadyForReview":
              message = messageTemplates.prReadyForReview(pr);
              break;
            case "reviewRequested":
              message = messageTemplates.reviewRequested(
                pr,
                context.reviewer || "reviewer"
              );
              break;
            default:
              message = prFormatter.formatPRForWhatsApp(
                pr,
                context.includeDetails
              );
          }
        } else {
          message = prFormatter.formatPRForWhatsApp(pr, context.includeDetails);
        }

        return {
          success: true,
          message,
        };
      } else {
        const prs = await githubService.getOpenPRs();

        let message: string;

        if (context.template === "dailyDigest") {
          message = messageTemplates.dailyDigest(prs);
        } else {
          message = prFormatter.formatMultiplePRsForWhatsApp(prs);
        }

        return {
          success: true,
          message,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to format PR message",
      };
    }
  },
});