# Environment Configuration Guide

## Overview
This document explains how environment variables are managed in the Mastra UFSC Server project, including validation, error handling, and setup instructions.

## Quick Start

1. **Copy the template:**
   ```bash
   cp .env.example .env
   ```

2. **Get your TMDB API Key:**
   - Visit https://www.themoviedb.org/settings/api
   - Create a free account if you don't have one
   - Request an API key (choose "Developer" option)
   - Copy your API Key (v3 auth)

3. **Update your .env file:**
   ```env
   TMDB_API_KEY=your_actual_api_key_here
   ```

4. **Test the configuration:**
   ```bash
   pnpm run dev
   ```

## Environment Variables

### Required Variables

#### TMDB_API_KEY
- **Purpose:** Access to The Movie Database API for movie search and details
- **How to get:** https://www.themoviedb.org/settings/api
- **Used by:** Movie Agent, Movie Search Tool, Movie Details Tool
- **Error if missing:** ❌ Clear error message with instructions

### Optional Variables

#### CAMBRIAN_API_KEY
- **Purpose:** Access to Cambrian API for DeFi/Blockchain data
- **How to get:** https://cambrian.ai
- **Used by:** DeFi Agents
- **Error if missing:** Only when DeFi features are used

#### CACHE_TTL
- **Purpose:** Configure cache duration in seconds
- **Default:** 3600 (1 hour)
- **Used by:** API caching system

#### RATE_LIMIT_REQUESTS / RATE_LIMIT_WINDOW
- **Purpose:** Configure rate limiting
- **Defaults:** 100 requests per 3600 seconds
- **Used by:** API rate limiting

## Environment Validation

### Centralized Validation
All environment variable validation is handled in `src/mastra/utils/env.ts`:

```typescript
import { getTmdbApiKey, validateEnvironment } from "./utils/env";

// Option 1: Validate specific variable when needed
const apiKey = getTmdbApiKey(); // Throws clear error if missing

// Option 2: Validate all at startup
validateEnvironment({ requireTmdb: true }); // Fail fast
```

### Error Messages
The validation system provides clear, actionable error messages:

```
❌ Missing TMDB_API_KEY in environment.
   → Create a .env file with: TMDB_API_KEY=your_key_here
   → Get your API key from: https://www.themoviedb.org/settings/api
   → See ai_notes/REAL_DATA_INTEGRATION/ENV_SETUP.md for detailed instructions
```

## Implementation Details

### env.ts Functions

#### `getTmdbApiKey(): string`
Validates and returns TMDB API key. Throws detailed error if missing.

#### `getOmdbApiKey(): string | undefined`
Returns OMDB API key if available (optional).

#### `getCacheTtl(): number`
Returns cache TTL with default fallback (3600).

#### `getRateLimitConfig(): { requests: number; window: number }`
Returns rate limit configuration with defaults.

#### `validateEnvironment(options): void`
Validates all required environment variables at startup.

### Usage in api-config.ts

The API configuration now uses getters to ensure validation happens when the key is actually accessed:

```typescript
export const API_KEYS = {
  get TMDB(): string {
    return getTmdbApiKey(); // Validates on access
  },
  get OMDB(): string {
    return getOmdbApiKey() || ""; // Optional
  },
};
```

## Best Practices

1. **Never commit .env files:** Already in .gitignore
2. **Always provide .env.example:** Template for new developers
3. **Fail fast:** Validate environment variables at startup
4. **Clear errors:** Provide actionable error messages
5. **Document requirements:** Keep this README updated

## Troubleshooting

### "Unauthorized" API Error
**Problem:** API returns 401 Unauthorized

**Solution:**
1. Check if `.env` file exists in project root
2. Verify `TMDB_API_KEY` is set in `.env`
3. Ensure the API key is valid (not expired)
4. Check there are no extra spaces around the key value

### Missing .env File
**Problem:** No `.env` file in project

**Solution:**
```bash
# Copy the example file
cp .env.example .env

# Edit and add your keys
nano .env  # or use your preferred editor
```

### Environment Variables Not Loading
**Problem:** Changes to `.env` not reflected

**Solution:**
1. Restart the development server
2. Ensure `dotenv/config` is imported at the top of entry files
3. Check file is named exactly `.env` (not `.env.txt` or similar)

## Related Documentation

- [ENV_SETUP.md](../REAL_DATA_INTEGRATION/ENV_SETUP.md) - Detailed setup for real movie data
- [.env.example](../../.env.example) - Environment template
- [src/mastra/utils/env.ts](../../src/mastra/utils/env.ts) - Validation implementation

## Future Improvements

- [ ] Add environment variable type validation (not just presence)
- [ ] Add environment variable documentation generator
- [ ] Add development vs production environment profiles
- [ ] Add encrypted environment variables for sensitive data



