# Movie Recommendation Agent 🎬

A sophisticated movie and series recommendation agent built with Mastra AI that helps users discover content based on their mood, preferences, and available streaming providers.

## Features

- 🎭 **Mood-Based Recommendations**: Analyzes user's emotional state to suggest perfect content
- 🎯 **Personalized Suggestions**: Learns from user preferences and viewing history
- 📺 **Multi-Provider Support**: Filters content by Netflix, Apple TV, HBO Max, and Stremio
- 🔍 **Advanced Search**: Find movies/series by title, genre, actors, directors, or year
- 🌍 **Bilingual Support**: Works in both Portuguese and English
- 💭 **Conversation Memory**: Remembers user preferences across sessions

## Supported Streaming Providers

- **Netflix** - Wide variety of content with 4K streaming
- **Apple TV** - Premium content with rental/purchase options
- **HBO Max** - HBO originals and Warner Bros movies
- **Stremio** - Free streaming aggregator

## Usage

### Running the Agent

```bash
cd mastra-ufsc-server

# Run test script
pnpm tsx test-movie-agent.ts

# Or use Mastra dev environment
pnpm mastra dev
```

### Example Conversations

**Setting Up Providers:**
- "I have Netflix and HBO Max"
- "Eu tenho Stremio e Apple TV"
- "What streaming services are available?"

**Mood-Based Recommendations:**
- "I'm feeling thoughtful and want something deep"
- "Estou animado e quero algo de ação"
- "I'm in a romantic mood tonight"
- "Feeling scared, show me some horror movies"

**Specific Searches:**
- "Find sci-fi series on Netflix"
- "Show me comedies from 2023"
- "Any movies with Margot Robbie?"
- "Procure filmes brasileiros"

**Getting Details:**
- "Tell me more about Wednesday"
- "Me conta sobre Duna: Parte Dois"
- "What's the rating for Oppenheimer?"

## Technical Architecture

### Core Components

```
src/mastra/
├── agents/
│   └── movie-agent.ts          # Main recommendation agent
├── tools/
│   ├── search-movies-tool.ts   # Search functionality
│   ├── get-movie-details-tool.ts # Detailed movie info
│   ├── recommend-by-mood-tool.ts # Mood-based recommendations
│   └── manage-providers-tool.ts  # Provider preferences
├── utils/
│   ├── movie-data.ts           # Movie database and types
│   ├── mood-mapper.ts          # Mood to genre mapping
│   └── provider-manager.ts     # User preferences & filtering
```

### Data Model

```typescript
interface Movie {
  id: string;
  title: string;
  type: 'movie' | 'series';
  year: number;
  genres: string[];
  rating: number;
  mood: Mood[];
  providers: Provider[];
  // ... more fields
}

type Mood = 'happy' | 'sad' | 'excited' | 'relaxed' | 'romantic' | 
            'adventurous' | 'thoughtful' | 'scared' | 'nostalgic' | 
            'energetic' | 'melancholic' | 'inspired';
```

### Mood Mapping System

The agent maps emotional states to content:

| Mood | Recommended Genres | Example Content |
|------|-------------------|-----------------|
| Happy | Comedy, Animation, Musical | Barbie, Task |
| Thoughtful | Drama, Documentary, Sci-Fi | Oppenheimer, Succession |
| Adventurous | Adventure, Action, Fantasy | Dune, Wednesday |
| Romantic | Romance, Drama | Past Lives, Poor Things |
| Scared | Horror, Thriller | Alien: Earth, The Menu |

### Personalization Features

1. **Provider Filtering**: Only shows content available on user's platforms
2. **Genre Preferences**: Learns liked/disliked genres over time
3. **Personalized Scoring**: Combines ratings, popularity, and user preferences
4. **Watch History**: Tracks viewed content (future enhancement)

## Example Interactions

### Portuguese Conversation
```
User: Olá! Quero assistir algo hoje à noite
Agent: Olá! 🎬 Fico feliz em ajudar você a encontrar algo perfeito para assistir! 

Primeiro, quais serviços de streaming você tem? (Netflix, Apple TV, HBO Max, Stremio)

User: Tenho Netflix e HBO Max
Agent: Ótimo! Netflix e HBO Max têm excelentes opções! 

Como você está se sentindo hoje? Está com vontade de algo mais:
- 😄 Leve e divertido
- 🤔 Reflexivo e profundo  
- 💕 Romântico
- 🎯 Cheio de ação
- 😱 Assustador

User: Estou pensativo, quero algo que me faça refletir
Agent: Perfeito para uma noite reflexiva! Aqui estão minhas recomendações:

1. **Succession** (HBO Max) ⭐ 8.9
   Drama sobre uma família poderosa lutando pelo controle
   
2. **Tudo em Todo Lugar ao Mesmo Tempo** (Netflix) ⭐ 7.8
   Ficção científica filosófica sobre universos paralelos
   
3. **Wednesday** (Netflix) ⭐ 8.1
   Mistério sombrio com toques de comédia por Tim Burton
```

### English Conversation
```
User: I want something exciting for movie night with friends
Agent: Perfect! 🍿 Let me help you find something exciting for your movie night!

For high-energy content with friends, I recommend:

1. **The Peacemaker** (HBO Max) ⭐ 8.5
   Action-packed superhero series with great humor
   
2. **Barbie** (HBO Max) ⭐ 7.0  
   Fun adventure comedy that's surprisingly clever
   
3. **Everything Everywhere All at Once** (Netflix) ⭐ 7.8
   Mind-bending action-comedy that's wildly entertaining
```

## Extending the Agent

### Adding New Movies/Series

Edit `src/mastra/utils/movie-data.ts`:

```typescript
{
  id: 'movie-xxx',
  title: 'New Movie Title',
  type: 'movie',
  year: 2024,
  genres: ['Drama', 'Thriller'],
  rating: 8.0,
  mood: ['thoughtful', 'intense'],
  providers: [
    { name: 'Netflix', type: 'stream', quality: '4K' }
  ],
  // ... additional fields
}
```

### Adding New Moods

1. Update the `Mood` type in `movie-data.ts`
2. Add mood mapping in `mood-mapper.ts`
3. Update tool schemas to include new mood

### Integration with Real APIs

To connect to real streaming data:

1. Replace mock data in `movie-data.ts` with API calls
2. Implement caching for performance
3. Add authentication for premium APIs
4. Consider rate limiting

## Best Practices

1. **Mood Detection**: The agent analyzes text for emotional keywords in both Portuguese and English
2. **Provider Management**: Always filter by user's available providers
3. **Personalization**: Use the scoring system to improve recommendations over time
4. **Language Support**: Respond in the user's language automatically

## Future Enhancements

- [ ] Real-time data from JustWatch/IMDB APIs
- [ ] Integration with streaming provider APIs
- [ ] Watch party suggestions for groups
- [ ] Reminder system for new releases
- [ ] Export watchlist functionality
- [ ] Rating and review system
- [ ] Social features (share recommendations)

## Troubleshooting

**Agent not found:**
```bash
# Ensure the agent is registered in src/mastra/index.ts
# Check that all imports are correct
```

**No recommendations showing:**
```bash
# Verify user has set their streaming providers
# Check that movie data includes provider information
```

**Mood not detected:**
```bash
# The agent defaults to 'thoughtful' mood if none detected
# Try being more explicit about emotional state
```

## Credits

Built with [Mastra AI](https://mastra.ai) framework for the UFSC Workshop.
Mock data inspired by popular Brazilian streaming content from JustWatch and IMDB.


