import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { whatsappService } from "../services/whatsapp-service";

export const sendWhatsAppTool = createTool({
  id: "send-whatsapp-message",
  description:
    "Sends a WhatsApp message to a specified recipient. Use when user wants to notify someone via WhatsApp.",

  inputSchema: z.object({
    recipient: z
      .string()
      .optional()
      .describe(
        "WhatsApp number in format whatsapp:+5511999999999. If not provided, uses default."
      ),
    message: z.string().describe("The message content to send"),
  }),

  outputSchema: z.object({
    success: z.boolean(),
    messageSid: z.string().optional(),
    error: z.string().optional(),
    recipient: z.string(),
    timestamp: z.string(),
  }),

  execute: async ({ context }) => {
    try {
      if (!whatsappService.isConfigured()) {
        return {
          success: false,
          error:
            "WhatsApp service not configured. Please set TWILIO credentials in .env",
          recipient: context.recipient || "unknown",
          timestamp: new Date().toISOString(),
        };
      }

      const recipient =
        context.recipient || whatsappService.getDefaultRecipient();

      if (!recipient) {
        return {
          success: false,
          error: "No recipient specified and no default recipient configured",
          recipient: "",
          timestamp: new Date().toISOString(),
        };
      }

      const result = await whatsappService.sendMessage({
        to: recipient,
        body: context.message,
      });

      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to send WhatsApp message",
        recipient: context.recipient || "unknown",
        timestamp: new Date().toISOString(),
      };
    }
  },
});