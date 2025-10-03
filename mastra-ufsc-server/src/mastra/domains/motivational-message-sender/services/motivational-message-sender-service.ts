// src/mastra/domains/telegram-agent/services/telegram-service.ts
import TelegramBot from 'node-telegram-bot-api';

interface TelegramConfig {
  botToken: string;
  webhookUrl?: string;
  rateLimit: {
    maxRequests: number;
    windowMs: number;
  };
}

export class TelegramService {
  private bot: TelegramBot;
  private rateLimiter: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(private config: TelegramConfig) {
    this.bot = new TelegramBot(config.botToken, { polling: false });
  }

  async sendMessage(chatId: string, message: string, options?: {
    parseMode?: 'HTML' | 'Markdown';
    disableWebPagePreview?: boolean;
    disableNotification?: boolean;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!this.checkRateLimit(chatId)) {
        return { success: false, error: 'Rate limit exceeded' };
      }

      const result = await this.bot.sendMessage(chatId, message, {
        parse_mode: options?.parseMode || 'HTML',
        disable_web_page_preview: options?.disableWebPagePreview || false,
        disable_notification: options?.disableNotification || false
      });
      
      return { 
        success: true, 
        messageId: result.message_id.toString() 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private checkRateLimit(chatId: string): boolean {
    const now = Date.now();
    const userLimit = this.rateLimiter.get(chatId);

    if (!userLimit) {
      this.rateLimiter.set(chatId, { count: 1, resetTime: now + this.config.rateLimit.windowMs });
      return true;
    }

    if (now > userLimit.resetTime) {
      this.rateLimiter.set(chatId, { count: 1, resetTime: now + this.config.rateLimit.windowMs });
      return true;
    }

    if (userLimit.count >= this.config.rateLimit.maxRequests) {
      return false;
    }

    userLimit.count++;
    return true;
  }
}