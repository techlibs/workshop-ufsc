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
# Movie Recommendation Agent - Implementation Summary

## Overview
Successfully implemented a comprehensive movie and series recommendation agent using Mastra AI that helps users discover content based on mood, preferences, and streaming providers available in Brazil.

## Implemented Components

### 1. Data Layer (`movie-data.ts`)
- Created comprehensive `Movie` interface with 18 fields
- Implemented 15+ popular movies/series from Brazilian streaming
- Added search functions with multiple filter options
- Included helper functions for various query types

### 2. Mood System (`mood-mapper.ts`)
- Defined 12 distinct mood categories
- Created mood-to-genre mapping system
- Implemented text analysis for mood detection (PT/EN)
- Built recommendation prompts based on mood

### 3. Provider Management (`provider-manager.ts`)
- User preference storage system
- Provider filtering functionality
- Personalized scoring algorithm
- Watch history and rating tracking
- Support for 4 major streaming platforms

### 4. Tools Implementation
- **search-movies-tool.ts**: Advanced search with personalization
- **get-movie-details-tool.ts**: Detailed movie information retrieval
- **recommend-by-mood-tool.ts**: Emotion-based recommendations
- **manage-providers-tool.ts**: Streaming service preferences

### 5. Movie Agent (`movie-agent.ts`)
- Bilingual support (Portuguese/English)
- Dynamic instruction generation
- Integration with all 4 tools
- Memory persistence with LibSQL
- Runtime context for user identification

## Key Features Achieved

✅ **Mood-Based Discovery**
- 12 mood categories mapped to appropriate genres
- Text analysis for mood detection
- Personalized mood-based scoring

✅ **Multi-Provider Support**
- Netflix, Apple TV, HBO Max, Stremio
- Automatic filtering by user's providers
- Rental/purchase options for Apple TV

✅ **Personalization**
- User preference tracking
- Genre preference learning
- Personalized content scoring
- Watch history consideration

✅ **Bilingual Interface**
- Automatic language detection
- Portuguese and English support
- Cultural awareness for Brazilian users

✅ **Rich Content Data**
- Detailed movie/series information
- IMDB ratings and popularity scores
- Cast, director, and synopsis
- Age ratings and episode counts

## Technical Decisions

1. **Mock Data Approach**: Created realistic dataset based on actual Brazilian streaming content
2. **In-Memory Storage**: Used Map for quick prototype, easily replaceable with database
3. **Scoring Algorithm**: Combined rating, popularity, preferences, and mood matching
4. **Tool Separation**: Each tool has single responsibility for maintainability
5. **Runtime Context**: Passed user ID through context for proper multi-user support

## Usage Examples

### Portuguese Interaction
```
User: "Estou me sentindo nostálgico hoje"
Agent: Recommends "Past Lives" and other nostalgic content
```

### English Interaction  
```
User: "I want something exciting for the weekend"
Agent: Suggests action-packed series like "The Peacemaker"
```

### Provider Management
```
User: "I only have Netflix and HBO"
Agent: Filters all recommendations to these platforms
```

## File Structure Created
```
mastra-ufsc-server/
├── src/mastra/
│   ├── agents/movie-agent.ts
│   ├── tools/
│   │   ├── search-movies-tool.ts
│   │   ├── get-movie-details-tool.ts
│   │   ├── recommend-by-mood-tool.ts
│   │   └── manage-providers-tool.ts
│   ├── utils/
│   │   ├── movie-data.ts
│   │   ├── mood-mapper.ts
│   │   └── provider-manager.ts
│   └── index.ts (updated)
├── test-movie-agent.ts
├── README_MOVIE_AGENT.md
└── ai_notes/MOVIE_AGENT/
    ├── README.md
    └── IMPLEMENTATION_SUMMARY.md
```

## Testing
Created comprehensive test script covering:
- Initial setup and provider configuration
- Mood-based recommendations in Portuguese
- Specific content search
- Movie detail retrieval
- Language switching
- Provider verification

## Future Enhancement Opportunities

1. **Real API Integration**
   - JustWatch API for real-time availability
   - IMDB API for ratings and metadata
   - Streaming provider APIs

2. **Advanced Features**
   - Collaborative filtering
   - Watch party suggestions
   - New release notifications
   - Export watchlist functionality

3. **Data Persistence**
   - Move from in-memory to database storage
   - User authentication system
   - Cross-device synchronization

4. **Enhanced Personalization**
   - Machine learning for better recommendations
   - Viewing time analysis
   - Social recommendations

## Conclusion
The movie recommendation agent successfully demonstrates Mastra AI's capabilities for building sophisticated conversational AI with tools, memory, and personalization. The modular architecture allows for easy extension and integration with real data sources.


