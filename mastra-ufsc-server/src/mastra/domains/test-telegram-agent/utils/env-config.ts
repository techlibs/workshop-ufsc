// src/mastra/domains/telegram-agent/utils/env-config.ts
export interface TelegramEnvConfig {
  botToken: string;
  defaultChatId?: string;
  webhookUrl?: string;
  rateLimit: {
    maxRequests: number;
    windowMs: number;
  };
}

export function getTelegramConfig(): TelegramEnvConfig {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const defaultChatId = process.env.TELEGRAM_CHAT_ID;
  const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;
  
  if (!botToken) {
    throw new Error(`
❌ Missing TELEGRAM_BOT_TOKEN in environment.
   → Create a .env file with: TELEGRAM_BOT_TOKEN=your_bot_token_here
   → Get your bot token from: @BotFather on Telegram
    `);
  }

  return {
    botToken,
    defaultChatId,
    webhookUrl,
    rateLimit: {
      maxRequests: parseInt(process.env.TELEGRAM_RATE_LIMIT_MAX || '10'),
      windowMs: parseInt(process.env.TELEGRAM_RATE_LIMIT_WINDOW || '60000')
    }
  };
}