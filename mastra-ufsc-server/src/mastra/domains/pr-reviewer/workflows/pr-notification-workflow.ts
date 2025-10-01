import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { githubService } from "../services/github-service";
import { whatsappService } from "../services/whatsapp-service";
import { prFormatter } from "../utils/pr-formatter";
import { messageTemplates } from "../utils/message-templates";

const fetchPRsStep = createStep({
  id: "fetch-prs",
  description: "Fetches pull requests from GitHub",

  inputSchema: z.object({
    prNumber: z.number().optional().describe("Specific PR number to fetch"),
    state: z
      .enum(["open", "closed", "all"])
      .optional()
      .default("open")
      .describe("Filter by state"),
  }),

  outputSchema: z.object({
    prs: z.array(z.any()),
    count: z.number(),
    success: z.boolean(),
  }),

  execute: async ({ inputData, mastra }) => {
    const logger = mastra?.getLogger();

    try {
      logger?.info("Fetching PRs from GitHub", {
        prNumber: inputData.prNumber,
        state: inputData.state,
      });

      let prs;

      if (inputData.prNumber) {
        const pr = await githubService.getPullRequest(inputData.prNumber);
        prs = [pr];
      } else {
        prs = await githubService.listPullRequests({
          state: inputData.state,
        });
      }

      logger?.info("Successfully fetched PRs", { count: prs.length });

      return {
        prs,
        count: prs.length,
        success: true,
      };
    } catch (error: any) {
      logger?.error("Failed to fetch PRs", { error: error.message });

      return {
        prs: [],
        count: 0,
        success: false,
      };
    }
  },
});

const formatMessageStep = createStep({
  id: "format-message",
  description: "Formats PR data into WhatsApp message",

  inputSchema: z.object({
    prs: z.array(z.any()),
    template: z
      .enum([
        "prOpened",
        "prReadyForReview",
        "reviewRequested",
        "prSummary",
        "dailyDigest",
      ])
      .optional(),
    includeDetails: z.boolean().optional().default(false),
    reviewer: z.string().optional(),
  }),

  outputSchema: z.object({
    message: z.string(),
    success: z.boolean(),
  }),

  execute: async ({ inputData, mastra }) => {
    const logger = mastra?.getLogger();

    try {
      logger?.info("Formatting message", {
        prCount: inputData.prs.length,
        template: inputData.template,
      });

      let message: string;

      if (inputData.prs.length === 1) {
        const pr = inputData.prs[0];

        if (inputData.template) {
          switch (inputData.template) {
            case "prOpened":
              message = messageTemplates.prOpened(pr);
              break;
            case "prReadyForReview":
              message = messageTemplates.prReadyForReview(pr);
              break;
            case "reviewRequested":
              message = messageTemplates.reviewRequested(
                pr,
                inputData.reviewer || "reviewer"
              );
              break;
            default:
              message = prFormatter.formatPRForWhatsApp(
                pr,
                inputData.includeDetails
              );
          }
        } else {
          message = prFormatter.formatPRForWhatsApp(pr, inputData.includeDetails);
        }
      } else {
        if (inputData.template === "dailyDigest") {
          message = messageTemplates.dailyDigest(inputData.prs);
        } else {
          message = prFormatter.formatMultiplePRsForWhatsApp(inputData.prs);
        }
      }

      logger?.info("Message formatted successfully", {
        messageLength: message.length,
      });

      return {
        message,
        success: true,
      };
    } catch (error: any) {
      logger?.error("Failed to format message", { error: error.message });

      return {
        message: `Error formatting message: ${error.message}`,
        success: false,
      };
    }
  },
});

const sendNotificationStep = createStep({
  id: "send-notification",
  description: "Sends WhatsApp notification",

  inputSchema: z.object({
    message: z.string(),
    recipient: z.string().optional(),
  }),

  outputSchema: z.object({
    success: z.boolean(),
    messageSid: z.string().optional(),
    error: z.string().optional(),
  }),

  execute: async ({ inputData, mastra }) => {
    const logger = mastra?.getLogger();

    try {
      logger?.info("Sending WhatsApp notification", {
        recipient: inputData.recipient,
        messageLength: inputData.message.length,
      });

      if (!whatsappService.isConfigured()) {
        logger?.warn("WhatsApp service not configured");

        return {
          success: false,
          error: "WhatsApp service not configured",
        };
      }

      const result = await whatsappService.sendMessage({
        to: inputData.recipient || whatsappService.getDefaultRecipient(),
        body: inputData.message,
      });

      if (result.success) {
        logger?.info("Notification sent successfully", {
          messageSid: result.messageSid,
        });
      } else {
        logger?.error("Failed to send notification", { error: result.error });
      }

      return {
        success: result.success,
        messageSid: result.messageSid,
        error: result.error,
      };
    } catch (error: any) {
      logger?.error("Exception sending notification", {
        error: error.message,
      });

      return {
        success: false,
        error: error.message,
      };
    }
  },
});

export const prNotificationWorkflow = createWorkflow({
  id: "pr-notification-workflow",
  description:
    "Complete workflow to fetch PRs, format message, and send WhatsApp notification",

  inputSchema: z.object({
    prNumber: z.number().optional(),
    recipient: z.string().optional(),
    template: z
      .enum([
        "prOpened",
        "prReadyForReview",
        "reviewRequested",
        "prSummary",
        "dailyDigest",
      ])
      .optional(),
    includeDetails: z.boolean().optional().default(false),
    reviewer: z.string().optional(),
  }),

  outputSchema: z.object({
    success: z.boolean(),
    prCount: z.number(),
    messageSid: z.string().optional(),
    error: z.string().optional(),
  }),
})
  .then(fetchPRsStep)
  .then(formatMessageStep)
  .then(sendNotificationStep);

prNotificationWorkflow.commit();