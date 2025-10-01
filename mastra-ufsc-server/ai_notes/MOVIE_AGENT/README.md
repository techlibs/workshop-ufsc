# Movie Recommendation Agent

## Overview
A Mastra AI agent that helps users discover movies and series based on their mood, preferences, and available streaming providers (Stremio, Netflix, Apple TV, HBO).

## Features
- Mood-based recommendations
- Filter by streaming providers
- Search movies/series by genre, director, actors
- Get detailed movie information
- Remember user preferences
- Personalized suggestions

## Architecture
- **Agent**: movie-agent.ts
- **Tools**: search-movies-tool.ts, get-movie-details-tool.ts, recommend-by-mood-tool.ts, manage-providers-tool.ts
- **Utils**: movie-data.ts, mood-mapper.ts, provider-manager.ts
- **Memory**: LibSQL for conversation and preference persistence

## Implementation Status
- [x] Project structure planning
- [x] Create movie data structure
- [x] Implement mood mapping utilities
- [x] Create provider filtering
- [x] Create movie tools
- [x] Create movie agent
- [x] Update Mastra configuration
- [x] Create test script
- [x] Create comprehensive documentation

## Key Features Implemented
- 15+ movies/series with Brazilian streaming availability
- 12 mood categories mapped to genres
- Personalized scoring algorithm
- Multi-language support (PT/EN)
- Provider preference management
- Conversation memory with LibSQL
