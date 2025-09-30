# UFSC Workshop - AI Integration Projects

This repository contains two independent AI/blockchain integration projects developed for the UFSC workshop.

## 📁 Project Structure

### 1. **cambrian-api/** 
TypeScript client for [Cambrian API](https://docs.cambrian.org) - blockchain and DeFi data access.

**Features:**
- 🔗 Multi-chain support (Solana, Base, Ethereum)
- 📊 Uniswap V3 pools integration
- 🪙 Real-time token price queries
- ⚡ Modular, type-safe client architecture

**Quick Start:**
```bash
cd cambrian-api
pnpm install
echo "CAMBRIAN_API_KEY=your-key" > .env
pnpm example:evm:pools
```

See [cambrian-api/README.md](./cambrian-api/README.md) for full documentation.

---

### 2. **mastra-ufsc-server/**
[Mastra framework](https://mastra.ai) implementation featuring intelligent weather agent with tools and workflows.

**Features:**
- 🤖 Weather Agent with dual execution paths
- 🛠️ Weather tools (current conditions, forecast)
- 📋 Activity planning workflow with formatted suggestions
- 🧠 Agent-Workflow composition pattern
- 💾 SQLite memory storage

**Quick Start:**
```bash
cd mastra-ufsc-server
pnpm install
pnpm dev
```

See `mastra-ufsc-server/ai_notes/INTEGRATION_SUMMARY.md` for architecture details.

---

## 🎯 Purpose

Educational projects demonstrating:
- **cambrian-api**: Blockchain data integration patterns
- **mastra-ufsc-server**: AI agent orchestration with Mastra framework

## 🛠️ Technologies

- **Node.js** 18+ / 20+
- **TypeScript** (strict mode)
- **pnpm** package manager
- **Mastra** framework (AI orchestration)
- **Cambrian** API (blockchain data)

## 📚 Documentation

Each subproject contains comprehensive documentation:
- `cambrian-api/` - API client documentation, examples, architecture guides
- `mastra-ufsc-server/ai_notes/` - AI integration notes, workflow diagrams

## 🚀 Getting Started

1. Choose your project of interest
2. Navigate to the project directory
3. Follow the respective README instructions

## 📄 License

MIT
