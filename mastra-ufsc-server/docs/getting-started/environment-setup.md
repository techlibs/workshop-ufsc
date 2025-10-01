# 🔧 Environment Setup Instructions

## Quick Setup (3 steps)

### 1. Create your .env file
```bash
# Copy the template
cp env.example .env
```

### 2. Get your TMDB API Key

1. Visit https://www.themoviedb.org/
2. Create a free account (if you don't have one)
3. Go to **Settings → API**
4. Click **"Create"** or **"Request an API Key"**
5. Choose **"Developer"** option
6. Fill in the form (use any website URL for testing)
7. Copy your **API Key (v3 auth)**

### 3. Update your .env file

Open `.env` and replace the placeholder:

```env
TMDB_API_KEY=your_actual_api_key_here
```

## Verify Setup

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



