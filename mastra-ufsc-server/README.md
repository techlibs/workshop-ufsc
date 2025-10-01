# Mastra UFSC Server

A collection of AI agents built with [Mastra AI](https://mastra.ai) for the UFSC workshop. This project demonstrates various agent capabilities including conversational AI, tool usage, workflows, and memory management.

## 🤖 Available Agents

- **Weather Agent** - Weather information and activity planning with multilingual support
- **Beach Agent** - Floripa beach recommendations for surfers and beach-goers
- **Movie Agent** - Personalized movie and series recommendations with mood-based discovery
- **Inventory Agent** - Interactive shopping assistant with cart management
- **Study Agent** - Educational assistant for blockchain and AI learning
- **DeFi Agent** - Decentralized exchange information and queries

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

```bash
# Copy the example file
cp env.example .env

# Add your API keys
# For movie agent: TMDB_API_KEY (get from https://www.themoviedb.org/settings/api)
# For DeFi agent: CAMBRIAN_API_KEY (optional)
```

See [Environment Setup Guide](./docs/getting-started/environment-setup.md) for detailed instructions.

### 3. Run Mastra Dev Server

```bash
pnpm run dev
```

Open http://localhost:4111 to interact with agents through the playground.

### 4. Run Example Tests

```bash
# Weather agent
pnpm tsx tests/e2e/beach-agent.e2e.ts

# Movie agent (requires TMDB_API_KEY)
pnpm tsx tests/e2e/movie-agent.e2e.ts

# Inventory agent
pnpm tsx tests/e2e/inventory-agent.e2e.ts
```

## 📁 Project Structure

```
mastra-ufsc-server/
├── src/mastra/
│   ├── domains/              # Domain-driven organization
│   │   ├── weather/          # Weather agent, tools, workflows
│   │   ├── beach/            # Beach recommendations
│   │   ├── movie/            # Movie recommendations with TMDB/JustWatch
│   │   ├── inventory/        # Shopping cart management
│   │   ├── study/            # Educational content
│   │   └── defi/             # DeFi queries
│   ├── shared/               # Shared utilities
│   │   ├── api/              # API clients and caching
│   │   └── config/           # Environment configuration
│   └── index.ts              # Main Mastra configuration
│
├── tests/                    # Organized test suite
│   ├── e2e/                  # End-to-end agent tests
│   └── integration/          # Integration tests
│
├── examples/                 # Usage examples
│   ├── weather/              # Weather examples
│   └── movie/                # Movie examples
│
├── docs/                     # Complete documentation
│   ├── getting-started/      # Setup guides
│   ├── agents/               # Agent-specific docs
│   ├── guides/               # How-to guides
│   ├── architecture/         # System design
│   └── development/          # Dev notes and history
│
└── env.example               # Environment template
```

## 📚 Documentation

See [docs/README.md](./docs/README.md) for complete documentation including:

- [Environment Setup](./docs/getting-started/environment-setup.md)
- [Agents Guide](./docs/guides/agents-guide.md)
- [Agent Documentation](./docs/agents/)
- [Architecture](./docs/architecture/)
- [Development Notes](./docs/development/)

## 🎯 Features

### Intelligent Routing
Agents automatically choose between tools and workflows based on user intent.

### Memory & Personalization
- Conversation history persistence
- User preferences and watch history
- Thread-based isolation

### Real-Time Data
- Movie data from TMDB and JustWatch
- Weather from Open-Meteo API
- DeFi data from Cambrian

### Multilingual Support
Agents support Portuguese, English, and Spanish.

## 🛠️ Development

### Run Development Server
```bash
pnpm run dev
```

### Run Tests
```bash
# All tests
pnpm tsx tests/e2e/*.e2e.ts

# Specific agent
pnpm tsx tests/e2e/movie-agent.e2e.ts
```

### Build for Production
```bash
pnpm run build
pnpm run start
```

## 🧪 Example Usage

### Weather Agent
```typescript
import { mastra } from "./src/mastra";

const agent = mastra.getAgent("weatherAgent");
const response = await agent.generate("What's the weather in Paris?");
console.log(response.text);
```

### Movie Agent
```typescript
const movieAgent = mastra.getAgent("movieAgent");
const response = await movieAgent.generate(
  "Find me action movies on Netflix",
  { runtimeContext: new Map([["userId", "user-123"]]) }
);
```

See [examples/](./examples/) for more usage patterns.

## 📝 Requirements

- Node.js >= 20.9.0
- pnpm (recommended) or npm
- API keys:
  - TMDB API key (for movie agent)
  - Cambrian API key (optional, for DeFi agent)

## 🤝 Contributing

This is an educational project for the UFSC workshop. See [docs/guides/agents-guide.md](./docs/guides/agents-guide.md) to learn how to build agents with Mastra.

## 📖 Learn More

- [Mastra Documentation](https://mastra.ai/docs)
- [Mastra GitHub](https://github.com/mastra-ai/mastra)
- [UFSC Workshop Materials](./docs/)

## 📄 License

Educational project for UFSC workshop.

