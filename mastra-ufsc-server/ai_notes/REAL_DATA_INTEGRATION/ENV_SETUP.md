# Environment Setup for Real Movie Data

## Required Environment Variables

Add these variables to your `.env` file:

```env
# Movie API Configuration
# Get your TMDB API key from https://www.themoviedb.org/settings/api
TMDB_API_KEY=your_tmdb_api_key_here

# Cache configuration (in seconds)
CACHE_TTL=3600  # 1 hour

# Rate limiting configuration
RATE_LIMIT_REQUESTS=100  # Number of requests
RATE_LIMIT_WINDOW=3600   # Window in seconds (1 hour)

# Optional: OMDB API key as backup (get from http://www.omdbapi.com/apikey.aspx)
# OMDB_API_KEY=your_omdb_api_key_here
```

## Getting API Keys

### TMDB (The Movie Database)
1. Go to https://www.themoviedb.org/
2. Create a free account
3. Go to Settings → API
4. Request an API key (choose "Developer" option)
5. Copy your API Key (v3 auth)

### JustWatch
- No API key required (uses public endpoints)
- Respects rate limiting automatically

## Testing the Integration

After setting up your environment variables, test the movie agent:

```typescript
// Test file: test-real-movie-data.ts
import { movieAgent } from "./src/mastra/agents/movie-agent";

async function testMovieAgent() {
  const response = await movieAgent.generate("Find me popular movies on Netflix");
  console.log(response.text);
}

testMovieAgent();
```

## Rate Limiting

The system automatically handles rate limiting to prevent API abuse:
- TMDB: 40 requests per 10 seconds (handled internally)
- JustWatch: Respects server rate limits with automatic retry

## Caching

All API responses are cached to improve performance:
- Search results: 1 hour
- Movie details: 1 hour  
- Trending/Popular: 30 minutes
- Genre lists: 24 hours

## Error Handling

The system gracefully handles:
- Network errors (with retry)
- Missing API keys
- Rate limit exceeded
- Invalid responses
- Cache failures

## Monitoring

Check the console logs for:
- API call details
- Cache hit/miss statistics
- Error messages
- Performance metrics


