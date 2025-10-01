# Real Movie Data Integration

The movie agent now uses **real-time data** from [JustWatch Brazil](https://www.justwatch.com/br) and [IMDB/TMDB](https://www.themoviedb.org/) instead of mocked data.

## 🚀 Quick Start

### 1. Get TMDB API Key
1. Go to https://www.themoviedb.org/
2. Create a free account
3. Go to Settings → API
4. Request an API key (choose "Developer" option)
5. Copy your API Key (v3 auth)

### 2. Configure Environment
Create a `.env` file in the project root:
```env
TMDB_API_KEY=your_api_key_here
```

### 3. Test the Integration
```bash
pnpm tsx test-real-movie-data.ts
```

## 📊 Data Sources

### TMDB (The Movie Database)
- **What**: Comprehensive movie and TV show information
- **Data**: Titles, ratings, cast, crew, genres, synopsis, images
- **Coverage**: Global content with Portuguese (Brazil) support

### JustWatch Brazil
- **What**: Real-time streaming availability in Brazil
- **Data**: Netflix, HBO Max, Prime Video, Apple TV availability
- **Coverage**: Current streaming options and rental/purchase prices

## 🎬 Usage Examples

### Search Movies
```typescript
import { searchMovies } from "./src/mastra/utils/movie-data";

const results = await searchMovies("Dune", {
  providers: ["Netflix", "HBO Max"],
  minRating: 7.0,
  type: "movie"
});
```

### Get Popular Content
```typescript
import { getPopularMovies } from "./src/mastra/utils/movie-data";

const popular = await getPopularMovies(10, "series");
```

### Find by Mood
```typescript
import { getMoviesByMood } from "./src/mastra/utils/movie-data";

const romantic = await getMoviesByMood(["romantic", "thoughtful"]);
```

### Use with Movie Agent
```typescript
import { movieAgent } from "./src/mastra/agents/movie-agent";

const response = await movieAgent.generate(
  "What are the best sci-fi movies on Netflix?",
  { runtimeContext: new Map([["userId", "user-123"]]) }
);
```

## 🛠️ Features

### Intelligent Caching
- Reduces API calls
- Configurable TTL
- LRU eviction policy

### Error Handling
- Automatic retry with backoff
- Graceful degradation
- Network timeout protection

### Performance
- Parallel API calls
- Request deduplication  
- Optimized data transformation

### Brazilian Localization
- Portuguese titles and descriptions
- Local streaming providers
- Brazilian age ratings

## 📝 Configuration Options

```env
# Required
TMDB_API_KEY=your_api_key_here

# Optional
CACHE_TTL=3600              # Cache time in seconds (default: 1 hour)
RATE_LIMIT_REQUESTS=100     # Max requests per window
RATE_LIMIT_WINDOW=3600      # Rate limit window in seconds
```

## 🔍 API Response Example

```json
{
  "id": "tmdb-movie-438631",
  "title": "Duna",
  "originalTitle": "Dune",
  "type": "movie",
  "year": 2021,
  "genres": ["Sci-Fi", "Adventure", "Drama"],
  "rating": 8.0,
  "duration": 155,
  "director": "Denis Villeneuve",
  "cast": ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
  "synopsis": "Paul Atreides, um jovem brilhante e talentoso...",
  "providers": [
    { "name": "HBO Max", "type": "stream", "quality": "4K" },
    { "name": "Apple TV", "type": "rent", "quality": "4K", "price": 19.90 }
  ],
  "mood": ["adventurous", "thoughtful", "inspired"],
  "language": ["English", "Portuguese"],
  "country": ["USA", "Canada"],
  "ageRating": "14",
  "popularity": 93,
  "imageUrl": "https://image.tmdb.org/t/p/w500/..."
}
```

## 🚧 Limitations

1. **API Key Required**: TMDB requires free registration
2. **Rate Limits**: Both APIs have rate limits (handled automatically)
3. **Network Dependency**: Requires internet connection
4. **JustWatch API**: Unofficial API may change without notice

## 🔄 Migration from Mock Data

All existing code continues to work! The functions signatures remain the same, but now return Promises:

```typescript
// Before (sync)
const movies = searchMovies("Dune");

// After (async)
const movies = await searchMovies("Dune");
```

## 📚 More Examples

See `examples/real-movie-search.ts` for a complete example.

## 🐛 Troubleshooting

### "API key not found"
- Make sure `.env` file exists with `TMDB_API_KEY`
- Check that the API key is valid

### "No results found"
- Verify internet connection
- Check if the movie/series exists in TMDB
- Try searching with different terms

### "Rate limit exceeded"
- Wait a few minutes
- The system will automatically retry

## 📈 Future Enhancements

- [ ] Add OMDB as fallback source
- [ ] Support more streaming providers
- [ ] Add user watchlist integration
- [ ] Implement Redis for distributed caching
- [ ] Add webhook support for real-time updates


