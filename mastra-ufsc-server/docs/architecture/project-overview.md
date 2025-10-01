# Project Architecture Overview

## Introduction

Mastra UFSC Server is a collection of AI agents built with the Mastra framework, demonstrating various agent capabilities and patterns.

## Domain-Driven Structure

The project follows a domain-driven design where each agent is organized as a self-contained domain:

```
src/mastra/domains/
├── weather/          # Weather information and activity planning
├── beach/            # Floripa beach recommendations
├── movie/            # Movie and series recommendations
├── inventory/        # Shopping cart management
├── study/            # Educational content
└── defi/             # DeFi and blockchain queries
```

## Domain Anatomy

Each domain follows a consistent structure:

```
domain-name/
├── agent.ts          # Main agent definition
├── workflow.ts       # Workflows (if applicable)
├── tools/            # Domain-specific tools
├── utils/            # Domain utilities
├── data/             # Static data
├── services/         # External API integrations
├── processors/       # Custom processors
└── index.ts          # Barrel exports
```

## Shared Components

Shared utilities are in `src/mastra/shared/`:

- **api/** - API clients, caching, configuration
- **config/** - Environment variables, app configuration

## Key Patterns

### 1. Agent-Tool-Workflow Pattern
- **Agents** - Decision makers that route to tools/workflows
- **Tools** - Discrete, reusable functions
- **Workflows** - Multi-step orchestrations

### 2. Memory Management
All agents use LibSQL for conversation persistence with thread-based isolation.

### 3. Runtime Context
Dynamic configuration passed to agents and tools at runtime (e.g., userId, threadId).

### 4. Output Processors
Custom processors transform agent responses (e.g., cart summary appended to inventory responses).

## Technology Stack

- **Framework**: Mastra AI
- **Language**: TypeScript
- **LLM**: OpenAI GPT-4o-mini / GPT-4o
- **Database**: LibSQL (SQLite-compatible)
- **Package Manager**: pnpm
- **Runtime**: Node.js 20+

## Integration Points

### External APIs
- **TMDB**: Movie and TV show data
- **JustWatch**: Streaming availability
- **Open-Meteo**: Weather data
- **Cambrian**: DeFi and blockchain data

### Storage
- **Memory**: LibSQL for conversation history
- **Working Memory**: In-memory Maps for runtime state
- **Vector Storage**: (Future) For semantic search

## Testing Strategy

- **E2E Tests**: Full agent conversations
- **Integration Tests**: Multi-component interactions
- **Unit Tests**: (Future) Individual component testing

## Deployment Considerations

See the Mastra documentation for deployment options:
- Serverless (Vercel, Netlify, Cloudflare Workers)
- Traditional servers (Express, Fastify)
- Docker containers

## Performance

- **Caching**: LRU cache for API responses (1-hour TTL)
- **Rate Limiting**: Automatic retry with backoff
- **Parallel Execution**: Where applicable in workflows

## Security

- **Environment Variables**: Sensitive keys in `.env` (never committed)
- **Input Validation**: Zod schemas on all tools
- **Error Handling**: Graceful degradation, no sensitive data in errors

## Future Enhancements

- [ ] Unit test coverage
- [ ] Redis for distributed caching
- [ ] Webhook integrations
- [ ] Multi-agent coordination
- [ ] Production deployment guide

