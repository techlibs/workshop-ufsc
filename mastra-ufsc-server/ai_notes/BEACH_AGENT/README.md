# Floripa Beach Agent Documentation

## Overview
The Beach Agent is an AI-powered assistant that helps users find the perfect beach in Florianópolis (Floripa) based on their preferences for surfing or relaxation.

## Implementation Summary

### 1. Beach Data Utility (`utils/beach-data.ts`)
- Comprehensive database of 15+ major beaches in Floripa
- Detailed characteristics for each beach including:
  - Surf quality (none, beginner, intermediate, advanced, pro)
  - Infrastructure levels
  - Crowd levels
  - Water quality
  - Family-friendliness
  - Activities available
- Helper functions for filtering beaches by activity, region, and surf level

### 2. Tools Created

#### Search Beaches Tool (`tools/search-beaches-tool.ts`)
- Searches beaches based on multiple criteria:
  - Activity preference (surfing/chilling)
  - Surf skill level
  - Region (Norte, Sul, Leste, Oeste)
  - Infrastructure requirements
  - Crowd preferences
  - Family-friendly options
- Returns ranked results with match reasons
- Limits results for focused recommendations

#### Beach Details Tool (`tools/beach-details-tool.ts`) 
- Provides comprehensive information about a specific beach
- Includes personalized recommendations based on beach characteristics
- Suggests similar beaches
- Offers safety and access information

### 3. Beach Agent (`agents/beach-agent.ts`)
- Expert knowledge of Floripa's beaches
- Enthusiastic and helpful personality
- Safety-conscious recommendations
- Cultural awareness (e.g., naturist beaches)
- Uses both tools intelligently to answer queries

## Key Features

1. **Comprehensive Beach Coverage**: Includes all major beaches from all regions of the island
2. **Surf Expertise**: Detailed surf conditions from beginner to pro level
3. **Safety First**: Warnings about dangerous conditions and difficult access
4. **Local Insights**: Highlights, best times to visit, and infrastructure details
5. **Personalized Recommendations**: Matches beaches to user preferences

## Usage Examples

```typescript
// Find intermediate surf spots
"I'm an intermediate surfer looking for good waves"

// Find relaxing beaches
"I want to chill on a quiet beach with good restaurants"

// Get specific beach info
"Tell me about Praia da Joaquina"

// Family-friendly options
"Best beaches for families with kids in the North"
```

## Testing
Run `npx tsx test-beach-agent.ts` to test various scenarios and agent responses.
