# Real Data Integration for Movie Agent

## Overview
Integration of real-time movie and streaming data from JustWatch Brazil and IMDB to replace the current mocked data.

## Data Sources

### JustWatch Brazil (justwatch.com/br)
- **Purpose**: Get real-time streaming availability in Brazil
- **Data**: 
  - Available streaming providers (Netflix, HBO Max, Prime Video, etc.)
  - Pricing for rent/buy options
  - Regional availability
  - Popular and trending content

### IMDB (imdb.com)
- **Purpose**: Get comprehensive movie/series information
- **Data**:
  - Title information (original and localized)
  - Ratings and reviews
  - Cast and crew details
  - Genre classification
  - Release dates
  - Synopsis/plot summaries

## Architecture Changes

### 1. External API Layer
- Create `external-api` utilities for fetching data
- Implement proper rate limiting and error handling
- Add caching mechanism to reduce API calls

### 2. Data Transformation
- Map external API responses to our Movie interface
- Handle missing or incomplete data gracefully
- Merge data from multiple sources

### 3. Async Operations
- Update all tools to handle async data fetching
- Implement proper loading states
- Add timeout handling

## Implementation Plan

1. **Create API Utilities**
   - `justwatch-api.ts` - JustWatch data fetching
   - `imdb-api.ts` - IMDB data fetching
   - `api-cache.ts` - Caching layer

2. **Update Data Layer**
   - Modify `movie-data.ts` to use real APIs
   - Keep the same interface for backward compatibility
   - Add data transformation logic

3. **Error Handling**
   - API rate limiting
   - Network errors
   - Data validation
   - Fallback to cached data

4. **Performance Optimization**
   - Implement Redis or in-memory caching
   - Batch API requests when possible
   - Use webhooks for real-time updates (future)

## API Integration Strategy

### JustWatch Integration
Since JustWatch doesn't have an official public API, we'll use:
- Web scraping with proper headers
- GraphQL endpoint discovery
- Respect robots.txt and rate limits

### IMDB Integration
Options:
- OMDB API (unofficial but reliable)
- TMDB API (alternative with good data)
- Web scraping as fallback

## Configuration
```typescript
// Environment variables needed
OMDB_API_KEY=<your-key>
TMDB_API_KEY=<your-key>
CACHE_TTL=3600 // 1 hour
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=3600
```

## Testing Strategy
- Mock external APIs in tests
- Test data transformation logic
- Verify error handling
- Performance testing with cache hits/misses


