# Cambrian API TypeScript Client

A clean, modular TypeScript application for interacting with the [Cambrian API](https://docs.cambrian.org) - a comprehensive API for blockchain and DeFi data across Solana, Base, and other EVM networks.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Cambrian API key ([Get one here](https://form.typeform.com/to/FlAoEzva?typeform-source=www.docs.cambrian.org/llms.txt))

### Installation

1. **Clone and install dependencies:**

```bash
pnpm install
```

2. **Set up your API key:**

Create a `.env` file in the project root:

```bash
CAMBRIAN_API_KEY=your-api-key-here
# Optional: Override base URL
# CAMBRIAN_BASE_URL=https://opabinia.cambrian.network
```

## 📁 Project Structure

```
workshop-ufsc/
├── src/
│   ├── client/
│   │   ├── cambrian-client.ts    # Core API client
│   │   └── types.ts               # TypeScript types
│   ├── examples/
│   │   ├── solana/
│   │   │   ├── latest-block.ts   # Get latest Solana block
│   │   │   └── price-current.ts  # Get token price
│   │   └── evm/
│   │       ├── evm-chains.ts              # List supported chains
│   │       ├── uniswap-v3-pools.ts        # List Uniswap V3 pools
│   │       └── uniswap-v3-pool-detail.ts  # Get pool details
│   └── utils/
│       └── env.ts                 # Environment utilities
├── .env                           # Your API key (create this)
├── package.json
└── tsconfig.json
```

## 🎯 Usage Examples

### Solana Examples

#### Get Latest Block

```bash
pnpm tsx src/examples/solana/latest-block.ts
```

#### Get Token Price

```bash
pnpm tsx src/examples/solana/price-current.ts So11111111111111111111111111111111111111112
```

### EVM Examples

#### List Supported Chains

```bash
pnpm tsx src/examples/evm/evm-chains.ts
```

#### Get Uniswap V3 Pools

```bash
# Get first 10 pools (default)
pnpm tsx src/examples/evm/uniswap-v3-pools.ts

# Get pools on Base chain
pnpm tsx src/examples/evm/uniswap-v3-pools.ts base 20

# Get pools on Ethereum
pnpm tsx src/examples/evm/uniswap-v3-pools.ts ethereum 10
```

#### Get Specific Pool Details

```bash
pnpm tsx src/examples/evm/uniswap-v3-pool-detail.ts 0x... base
```

## 💻 Using the Client Programmatically

You can import and use the client in your own TypeScript code:

```typescript
import { createClient } from "./src/client/cambrian-client";

async function example() {
  const client = createClient("your-api-key");
  
  // Solana
  const block = await client.getLatestBlock();
  const price = await client.getCurrentPrice("So111...");
  
  // EVM
  const chains = await client.getEvmChains();
  const pools = await client.getUniswapV3Pools({ chain: "base", limit: 10 });
  const pool = await client.getUniswapV3Pool("0x...", "base");
}
```

## 🔧 Available Client Methods

### Solana

- `getLatestBlock()` - Get latest Solana block
- `getCurrentPrice(address)` - Get current token price
- `getTokenDetails(address)` - Get detailed token info

### EVM

- `getEvmChains()` - List supported chains
- `getUniswapV3Pools(params)` - List Uniswap V3 pools
- `getUniswapV3Pool(address, chain)` - Get specific pool details
- `getEvmPrice(address, chain)` - Get token price
- `getEvmTokens(chain, limit?, offset?)` - List whitelisted tokens

### Advanced

- `getRaw(path, options)` - Get raw API response
- `getObjects(path, options)` - Get parsed response as objects
- `tabularToObjects(payload)` - Convert tabular data to objects

## 📚 Documentation

- [Cambrian API Docs](https://docs.cambrian.org)
- [OpenAPI Schema](https://opabinia.cambrian.network/openapi.json)
- [API Reference](./agents.md)

## 🛠️ Development

### Type Checking

```bash
pnpm typecheck
```

### Watch Mode

```bash
pnpm dev
```

## 📝 Notes

- All examples use the modular client from `src/client/cambrian-client.ts`
- Easy to extend with new endpoints - just add methods to the client class
- Type-safe with TypeScript
- Clean separation of concerns (client, examples, utilities)

## 🤝 Support

For questions or issues, visit the [Cambrian Discord](https://discord.com/channels/1375182661202481172/1376641098516271155)

## 📄 License

MIT
