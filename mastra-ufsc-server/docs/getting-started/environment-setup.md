# 🔧 Environment Setup Instructions

## Quick Setup

This guide covers API keys used in this project. For other APIs, see [API Keys Guide](./api-keys-guide.md).

### 1. Create your .env file
```bash
# Copy the template
cp env.example .env
```

### 2. Configure Required API Keys

#### OpenAI (Required)
**Purpose:** AI agent models (GPT-4)

1. Visit https://platform.openai.com/signup
2. Create account and verify email
3. Go to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-`)
6. Add to `.env`:
```env
OPENAI_API_KEY=sk-xxx
```

#### GitHub (for PR agents)
**Purpose:** Repository access, PRs, webhooks

1. Visit https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Select scopes: ✅ `repo` (full repository access)
4. Click **"Generate token"**
5. Copy token (starts with `ghp_`)
6. Add to `.env`:
```env
GITHUB_TOKEN=ghp_xxx
GITHUB_OWNER=your_username_or_org
GITHUB_REPO=your_repository_name
GITHUB_WEBHOOK_SECRET=your_random_secret_string
```

#### Telegram (for notifications)
**Purpose:** Telegram bot notifications

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Choose bot name and username (must end with `bot`)
4. Copy HTTP API token
5. Get Chat ID:
   - Send message to bot
   - Visit `https://api.telegram.org/bot<TOKEN>/getUpdates`
   - Copy `chat.id` from response
6. Add to `.env`:
```env
TELEGRAM_BOT_TOKEN=123456:ABCdef
TELEGRAM_CHAT_ID=123456789
```

#### TMDB (Optional - for movie agent)
**Purpose:** Movie/TV show data

1. Visit https://www.themoviedb.org/
2. Create free account
3. Go to **Settings → API**
4. Request API key (choose Developer)
5. Copy **API Key (v3 auth)**
6. Add to `.env`:
```env
TMDB_API_KEY=xxx
```

### 3. Verify Setup

Run the server to test:
```bash
pnpm run dev
```

If you see this error:
```
❌ Missing TMDB_API_KEY in environment.
   → Create a .env file with: TMDB_API_KEY=your_key_here
   → Get your API key from: https://www.themoviedb.org/settings/api
```

Then your `.env` file is not properly configured. Make sure:
- File is named exactly `.env` (not `.env.txt`)
- File is in the project root directory
- API key has no extra spaces or quotes
- You've restarted the server after creating the file

## What This Fixes

The environment variable validation now provides **clear, actionable error messages** when configuration is missing:

### Before ❌
```
ApiError: API request failed: Unauthorized
```

### After ✅
```
❌ Missing TMDB_API_KEY in environment.
   → Create a .env file with: TMDB_API_KEY=your_key_here
   → Get your API key from: https://www.themoviedb.org/settings/api
   → See ai_notes/REAL_DATA_INTEGRATION/ENV_SETUP.md for detailed instructions
```

## Additional Documentation

- [env.example](./env.example) - Template for all environment variables
- [ai_notes/ENV_CONFIGURATION/](./ai_notes/ENV_CONFIGURATION/) - Detailed configuration guide
- [ai_notes/REAL_DATA_INTEGRATION/ENV_SETUP.md](./ai_notes/REAL_DATA_INTEGRATION/ENV_SETUP.md) - Movie API setup guide

## Troubleshooting

### Still getting "Unauthorized" errors?

1. **Check your API key is valid:**
   - Log into TMDB and verify your API key is active
   - Make sure you copied the v3 API key (not v4)

2. **Check .env file location:**
   ```bash
   # Should be in project root
   ls -la .env
   ```

3. **Check .env file contents:**
   ```bash
   cat .env | grep TMDB_API_KEY
   ```

4. **Restart your server:**
   ```bash
   # Stop the server (Ctrl+C) and restart
   pnpm run dev
   ```

### Environment variables not loading?

Make sure `dotenv` is installed:
```bash
pnpm list dotenv
```

If not installed:
```bash
pnpm add dotenv
```

## Next Steps

Once your environment is set up:
1. Test the movie agent: `npx tsx test-movie-agent.ts`
2. Try the real movie search: `npx tsx examples/real-movie-search.ts`
3. Explore the Movie Agent capabilities in the interactive mode

---

**Need help?** Check the detailed guides in `ai_notes/` or review the error messages for specific instructions.



