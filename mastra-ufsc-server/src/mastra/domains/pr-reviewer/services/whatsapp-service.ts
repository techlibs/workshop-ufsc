import twilio from "twilio";
import type { WhatsAppMessage, NotificationResult } from "../types/pr-types";
import { secrets } from "../config/secrets";
import { rateLimiter } from "../utils/rate-limiter";
import { idempotencyManager } from "../utils/idempotency-manager";

export class WhatsAppService {
  private client: twilio.Twilio | null = null;
  private from: string;
  private defaultTo: string;

  constructor() {
    if (secrets.hasWhatsAppCredentials()) {
      this.client = twilio(
        secrets.get("TWILIO_ACCOUNT_SID"),
        secrets.get("TWILIO_AUTH_TOKEN")
      );
      this.from = secrets.get("TWILIO_WHATSAPP_FROM");
      this.defaultTo = secrets.getOptional("TWILIO_WHATSAPP_TO") || "";
    } else {
      this.from = "";
      this.defaultTo = "";
    }
  }

  async sendMessage(message: WhatsAppMessage): Promise<NotificationResult> {
    if (!this.client) {
      return {
        success: false,
        error: "WhatsApp credentials not configured",
        prNumber: 0,
        recipient: message.to,
        timestamp: new Date().toISOString(),
      };
    }

    const recipient = message.to || this.defaultTo;

    if (!recipient) {
      return {
        success: false,
        error: "No recipient specified",
        prNumber: 0,
        recipient: "",
        timestamp: new Date().toISOString(),
      };
    }

    const canSend = await rateLimiter.checkLimit(recipient);
    if (!canSend) {
      const remaining = rateLimiter.getRemainingRequests(recipient);
      return {
        success: false,
        error: `Rate limit exceeded. ${remaining} requests remaining.`,
        prNumber: 0,
        recipient,
        timestamp: new Date().toISOString(),
      };
    }

    const idempotencyKey = idempotencyManager.generateKey({
      to: recipient,
      body: message.body,
      timestamp: new Date().toISOString().slice(0, 16),
    });

    const result = await idempotencyManager.execute(idempotencyKey, async () => {
      try {
        const response = await this.client!.messages.create({
          from: message.from || this.from,
          to: recipient,
          body: message.body,
        });

        return {
          success: true,
          messageSid: response.sid,
          prNumber: 0,
          recipient,
          timestamp: new Date().toISOString(),
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || "Failed to send WhatsApp message",
          prNumber: 0,
          recipient,
          timestamp: new Date().toISOString(),
        };
      }
    });

    return result.result;
  }

  async sendBulkMessages(
    messages: WhatsAppMessage[]
  ): Promise<NotificationResult[]> {
    const results: NotificationResult[] = [];

    for (const message of messages) {
      const result = await this.sendMessage(message);
      results.push(result);

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return results;
  }

  isConfigured(): boolean {
    return this.client !== null;
  }

  getDefaultRecipient(): string {
    return this.defaultTo;
  }
}

export const whatsappService = new WhatsAppService();