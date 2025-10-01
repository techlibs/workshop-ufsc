# Mastra UFSC Server Documentation

Welcome to the Mastra UFSC Server documentation. This project contains multiple AI agents built with the Mastra framework for the UFSC workshop.

## 📚 Documentation Structure

### 🚀 Getting Started
- [Environment Setup](./getting-started/environment-setup.md) – Configure environment variables and API keys

### 🤖 Agents
Current agent guides:
- [Beach Agent](./agents/beach-agent.md) – Floripa beach recommendations
- [Inventory Agent](./agents/inventory-agent.md) – Shopping assistant with cart management
- [Movie Agent](./agents/movie-agent.md) – Movie and series recommendations

> Additional domains (`weather`, `study`, `defi`) follow the same folder conventions and are documented in the domain reference within `agents.md`.

### 📖 Guides
- [Agents Guide](./guides/agents-guide.md) – Building AI agents with Mastra
- [Real Movie Data Integration](./guides/real-movie-data.md) – Using TMDB and JustWatch APIs
- [Mastra Reference](./guides/mastra-reference.md) – Complete Mastra framework documentation
- [Cursor Shopping Guide](./guides/cursor-shopping-guide.md) – Interactive shopping agent tutorial

### 🏗️ Architecture
- [Project Overview](./architecture/project-overview.md)
- [Domain Structure](./architecture/domain-structure.md)

### 👨‍💻 Development
- [AI Notes](./development/ai-notes/) – Implementation notes and fixes
- [Plans](./development/plans/) – Strategic planning documents and workflow templates

## 🎯 Quick Links

### For New Users
1. [Environment Setup](./getting-started/environment-setup.md)
2. [Agents Guide](./guides/agents-guide.md)
3. Explore domain architecture in [Domain Structure](./architecture/domain-structure.md)

### For Developers
1. [Mastra Reference](./guides/mastra-reference.md)
2. [AI Notes](./development/ai-notes/)
3. [Plans](./development/plans/)

## 🔧 Running Examples

All code examples live in the `examples/` directory at the project root:

```bash
# Weather examples
pnpm tsx examples/weather/api-usage-example.ts

# Movie examples
pnpm tsx examples/movie/real-movie-search.ts
```

## 🧪 Running Tests

Tests are organised in the `tests/` directory:

```bash
# E2E tests
pnpm tsx tests/e2e/beach-agent.e2e.ts
pnpm tsx tests/e2e/movie-agent.e2e.ts
pnpm tsx tests/e2e/inventory-agent.e2e.ts
pnpm tsx tests/e2e/study-agent.e2e.ts

# Integration tests
pnpm tsx tests/integration/weather/integration.spec.ts
```

## 📦 Project Structure

```text
mastra-ufsc-server/
├── src/mastra/
│   ├── domains/          # Domain-driven organisation (agents, tools, workflows)
│   ├── shared/           # Shared utilities
│   └── index.ts          # Main Mastra configuration
├── tests/                # E2E and integration suites
├── examples/             # Usage examples
└── docs/                 # Documentation (this folder)
```

## 🤝 Contributing

See the AI notes and plans for implementation patterns, 4-phase workflow guidance, and best practices used in this project.

## 📝 License

This is an educational project created for the UFSC workshop.

