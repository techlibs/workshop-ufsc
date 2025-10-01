# Floripa Beach Agent 🏖️ 🏄‍♂️

An AI-powered beach recommendation agent for Florianópolis (Floripa), Brazil. This agent helps users find the perfect beach based on their preferences for surfing, relaxation, or other activities.

## Features

- **Comprehensive Beach Database**: Information on 15+ major beaches across all regions of Floripa
- **Intelligent Recommendations**: Finds beaches based on:
  - Activity preferences (surfing vs chilling)
  - Surf skill level (beginner to pro)
  - Infrastructure needs
  - Crowd preferences  
  - Family-friendliness
- **Detailed Beach Information**: Provides comprehensive details including access, activities, and local tips
- **Safety Awareness**: Warns about dangerous conditions and difficult access
- **Local Expertise**: Includes insider knowledge and cultural context

## Quick Start

### 1. Test the Agent

```bash
npx tsx test-beach-agent.ts
```

This will run through several test scenarios demonstrating the agent's capabilities.

### 2. Use in Your Code

```typescript
import { mastra } from "./src/mastra";

const beachAgent = mastra.getAgent("beachAgent");

// Find surf beaches for intermediate level
const response = await beachAgent.generate(
  "I'm an intermediate surfer looking for good waves",
  {
    memory: {
      resource: "user-123",
      thread: { id: "beach-search-1" }
    }
  }
);

console.log(response.text);
```

## Example Queries

### For Surfers
- "I'm a beginner surfer, where should I go?"
- "Looking for pro-level waves with competitions"
- "Best intermediate surf spots in the South region"

### For Beach Relaxation
- "I want a quiet beach with good restaurants"
- "Family-friendly beaches with calm water"
- "Luxurious beach with beach clubs"

### Specific Beach Information
- "Tell me about Praia da Joaquina"
- "Is Jurerê Internacional good for surfing?"
- "What's special about Lagoinha do Leste?"

### Mixed Preferences
- "I want to surf in the morning and relax in the afternoon"
- "Beaches good for both families and intermediate surfers"

## Beach Categories

### By Surf Level
- **No Surf**: Jurerê Internacional, Canasvieiras, Santo Antônio de Lisboa
- **Beginner**: Armação, Barra da Lagoa
- **Intermediate**: Praia Brava, Mole, Santinho, Matadeiro
- **Advanced**: Campeche, Moçambique, Lagoinha do Leste
- **Pro**: Joaquina (hosts international competitions)

### By Region
- **Norte (North)**: Tourist-friendly, calmer waters, great infrastructure
- **Sul (South)**: Traditional villages, varied surf conditions
- **Leste (East)**: Famous surf beaches, stunning nature
- **Oeste (West)**: Bay side, no waves but beautiful sunsets

### Special Beaches
- **Most Luxurious**: Jurerê Internacional
- **Best Sunset**: Santo Antônio de Lisboa
- **Most Remote**: Lagoinha do Leste (requires hiking)
- **Naturist**: Galheta
- **Longest**: Moçambique (13km)

## Architecture

```
├── agents/
│   └── beach-agent.ts         # Main agent with instructions
├── tools/
│   ├── search-beaches-tool.ts # Multi-criteria beach search
│   └── beach-details-tool.ts  # Detailed beach information
└── utils/
    └── beach-data.ts          # Comprehensive beach database
```

## Development

### Adding New Beaches

Edit `src/mastra/utils/beach-data.ts` and add new beach entries to the `floripaBeaches` array.

### Modifying Search Criteria

Update the input schema in `src/mastra/tools/search-beaches-tool.ts` to add new search parameters.

### Enhancing Agent Knowledge

Modify the instructions in `src/mastra/agents/beach-agent.ts` to improve the agent's responses.

## Notes

- Beach conditions can vary by season and weather
- Always check current conditions before visiting
- Some beaches require hiking or 4x4 vehicles for access
- Respect local customs and environmental regulations

Enjoy discovering the beautiful beaches of Floripa! 🌊 ☀️
