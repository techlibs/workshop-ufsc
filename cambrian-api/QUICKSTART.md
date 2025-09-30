# 🚀 Quick Start Guide

## Setup (2 minutes)

1. **Get your API key:**
   - Visit: https://form.typeform.com/to/FlAoEzva?typeform-source=www.docs.cambrian.org/llms.txt
   - Copy your API key

2. **Create `.env` file:**
   ```bash
   echo "CAMBRIAN_API_KEY=your-api-key-here" > .env
   ```

3. **Install dependencies:**
   ```bash
   pnpm install
   ```

## Run Examples

### 1️⃣ Solana Examples

**Get latest block:**
```bash
pnpm example:solana:block
```

**Get token price:**
```bash
pnpm example:solana:price So11111111111111111111111111111111111111112
```

### 2️⃣ EVM Examples  

**List supported chains:**
```bash
pnpm example:evm:chains
```

**Get Uniswap V3 pools:**
```bash
# Default (first 10 pools)
pnpm example:evm:pools

# With arguments: [chain] [limit]
pnpm tsx src/examples/evm/uniswap-v3-pools.ts base 20
```

**Get specific pool details:**
```bash
pnpm example:evm:pool 0x... base
```

## 💡 Create Your Own Script

Create a new file in `src/examples/`:

```typescript
// src/examples/my-script.ts
import { createClient } from "../client/cambrian-client";
import { getApiKey } from "../utils/env";

async function main() {
  const client = createClient(getApiKey());
  
  // Use any client method
  const pools = await client.getUniswapV3Pools({ 
    chain: "base", 
    limit: 5 
  });
  
  console.log(pools);
}

void main();
```

Run it:
```bash
pnpm tsx src/examples/my-script.ts
```

## 📖 Available Client Methods

```typescript
const client = createClient(apiKey);

// Solana
await client.getLatestBlock()
await client.getCurrentPrice(address)
await client.getTokenDetails(address)

// EVM
await client.getEvmChains()
await client.getUniswapV3Pools({ chain, limit, offset })
await client.getUniswapV3Pool(address, chain)
await client.getEvmPrice(address, chain)
await client.getEvmTokens(chain, limit, offset)

// Advanced
await client.getRaw(path, options)
await client.getObjects(path, options)
```

## 🔗 Resources

- [Full Documentation](./README.md)
- [Cambrian API Docs](https://docs.cambrian.org)
- [API Reference](./agents.md)

## 🆘 Troubleshooting

**Error: Missing CAMBRIAN_API_KEY**
- Make sure you created `.env` file with your API key

**Error: Request failed 401**
- Your API key is invalid or expired

**Error: Request failed 404**
- Check the endpoint path and parameters

Need help? [Join Discord](https://discord.com/channels/1375182661202481172/1376641098516271155)
