# 📸 Visual Project Guide

## 📂 Project Structure (Tree View)

```
workshop-ufsc/
│
├── 📦 Configuration Files
│   ├── .env                    # Your API key (create this!)
│   ├── .gitignore             # Git ignore rules
│   ├── package.json           # NPM scripts & dependencies
│   └── tsconfig.json          # TypeScript config
│
├── 📚 Documentation
│   ├── README.md              # 📖 Full documentation
│   ├── QUICKSTART.md          # 🚀 2-minute setup guide
│   ├── ARCHITECTURE.md        # 🏗️  Architecture deep dive
│   ├── PROJECT_SUMMARY.md     # 📋 What changed
│   ├── VISUAL_GUIDE.md        # 📸 This file
│   └── agents.md              # 📡 API reference
│
├── 🗂️  Legacy Files (for reference)
│   ├── cambrian.legacy.ts     # Old CLI
│   └── README.old.md          # Old docs
│
└── 📁 src/                    # Source code
    │
    ├── 🔧 client/             # Core API client
    │   ├── cambrian-client.ts # Main client class
    │   └── types.ts           # TypeScript types
    │
    ├── 📚 examples/           # Runnable examples
    │   ├── solana/
    │   │   ├── latest-block.ts     # Example
    │   │   └── price-current.ts    # Example
    │   └── evm/
    │       ├── evm-chains.ts              # Example
    │       ├── uniswap-v3-pools.ts        # Example ⭐
    │       └── uniswap-v3-pool-detail.ts  # Example
    │
    └── 🛠️  utils/             # Shared utilities
        └── env.ts             # Environment helpers
```

## 🎯 How Everything Connects

```
┌─────────────────────────────────────────────────────────────┐
│                     YOU (Developer)                          │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ Run: pnpm example:evm:pools
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│          📚 Example Script                                   │
│          src/examples/evm/uniswap-v3-pools.ts               │
│                                                              │
│  1. Import client & utils                                   │
│  2. Get API key from .env                                   │
│  3. Create client instance                                  │
│  4. Call client.getUniswapV3Pools()                        │
│  5. Display results                                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ createClient(apiKey)
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│          🔧 Cambrian Client                                  │
│          src/client/cambrian-client.ts                      │
│                                                              │
│  class CambrianClient {                                     │
│    - buildUrl()           # Build API URL                   │
│    - get()                # Make HTTP request               │
│    - tabularToObjects()   # Parse response                  │
│    - getUniswapV3Pools()  # Your API call                  │
│  }                                                           │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ HTTP GET + API key
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│          🌐 Cambrian API                                     │
│          https://opabinia.cambrian.network                  │
│                                                              │
│  Endpoint: /api/v1/evm/uniswap/v3/pools                    │
│  Returns: Tabular JSON data                                 │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ Tabular JSON response
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│          🔧 Response Parser                                  │
│          tabularToObjects()                                 │
│                                                              │
│  Converts:                                                   │
│  { columns: [...], data: [[...]] }                         │
│  ▼                                                           │
│  [{ pool_address: "0x...", tvl: 1000000, ... }]           │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ Array of objects
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│          📚 Example Script                                   │
│          (displays results)                                 │
│                                                              │
│  console.log("Found X pools:")                              │
│  pools.forEach(pool => { ... })                            │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Commands Cheat Sheet

### Setup
```bash
# 1. Create .env file
echo "CAMBRIAN_API_KEY=your-key" > .env

# 2. Install dependencies
pnpm install

# 3. Type check
pnpm typecheck
```

### Run Examples

#### Solana
```bash
# Latest block
pnpm example:solana:block

# Token price (needs token address)
pnpm example:solana:price So11111111111111111111111111111111111111112
```

#### EVM
```bash
# List supported chains
pnpm example:evm:chains

# List Uniswap V3 pools (default: 10 pools)
pnpm example:evm:pools

# With arguments: chain and limit
pnpm tsx src/examples/evm/uniswap-v3-pools.ts base 20
pnpm tsx src/examples/evm/uniswap-v3-pools.ts ethereum 5

# Get specific pool details
pnpm example:evm:pool 0x... base
```

### Development
```bash
# Run any TypeScript file
pnpm tsx src/examples/path/to/file.ts

# Watch mode
pnpm dev

# Type check
pnpm typecheck
```

## 📝 Creating Your Own Script

### Step 1: Create file
```bash
# Create new example file
touch src/examples/my-custom-script.ts
```

### Step 2: Write code
```typescript
/**
 * My Custom Script
 * Run: pnpm tsx src/examples/my-custom-script.ts
 */

import { createClient } from "../client/cambrian-client.js";
import { getApiKey, getBaseUrl } from "../utils/env.js";

async function main() {
  console.log("🔍 Running my custom script...\n");
  
  // Create client
  const client = createClient(getApiKey(), getBaseUrl());
  
  try {
    // Call any client method
    const pools = await client.getUniswapV3Pools({ 
      chain: "base", 
      limit: 5 
    });
    
    // Process results
    console.log(`✅ Found ${pools.length} pools:`);
    pools.forEach((pool: any, i: number) => {
      console.log(`${i + 1}. ${pool.token0_symbol}/${pool.token1_symbol}`);
    });
    
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

void main();
```

### Step 3: Run it
```bash
pnpm tsx src/examples/my-custom-script.ts
```

### Step 4: (Optional) Add NPM script
```json
// package.json
{
  "scripts": {
    "my:script": "tsx src/examples/my-custom-script.ts"
  }
}
```

Then run:
```bash
pnpm my:script
```

## 🎨 Code Templates

### Template 1: Simple Data Fetch
```typescript
import { createClient } from "../client/cambrian-client.js";
import { getApiKey } from "../utils/env.js";

async function main() {
  const client = createClient(getApiKey());
  const data = await client.getUniswapV3Pools({ chain: "base" });
  console.log(data);
}

void main();
```

### Template 2: With Arguments
```typescript
import { createClient } from "../client/cambrian-client.js";
import { getApiKey } from "../utils/env.js";

async function main() {
  const chain = process.argv[2] ?? "base";
  const limit = parseInt(process.argv[3] ?? "10", 10);
  
  const client = createClient(getApiKey());
  const pools = await client.getUniswapV3Pools({ chain, limit });
  
  console.log(`Found ${pools.length} pools on ${chain}`);
}

void main();
```

### Template 3: With Error Handling
```typescript
import { createClient } from "../client/cambrian-client.js";
import { getApiKey } from "../utils/env.js";

async function main() {
  const client = createClient(getApiKey());
  
  try {
    const data = await client.getUniswapV3Pools({ chain: "base" });
    console.log("✅ Success:", data);
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Error:", error.message);
    }
    process.exit(1);
  }
}

void main();
```

## 🔧 Available Client Methods

### 📦 Client Creation
```typescript
import { createClient } from "./src/client/cambrian-client.js";

// Basic
const client = createClient("your-api-key");

// With custom base URL
const client = createClient("your-api-key", "https://custom.url");
```

### 🔵 Solana Methods
```typescript
// Get latest block
await client.getLatestBlock()

// Get current price
await client.getCurrentPrice(tokenAddress)

// Get token details
await client.getTokenDetails(tokenAddress)
```

### 🟢 EVM Methods
```typescript
// Get supported chains
await client.getEvmChains()

// List Uniswap V3 pools
await client.getUniswapV3Pools({ chain, limit, offset })

// Get specific pool
await client.getUniswapV3Pool(poolAddress, chain)

// Get token price
await client.getEvmPrice(tokenAddress, chain)

// List tokens
await client.getEvmTokens(chain, limit, offset)
```

### 🔴 Advanced Methods
```typescript
// Get raw API response
await client.getRaw(path, options)

// Get parsed objects
await client.getObjects(path, options)

// Parse tabular data
client.tabularToObjects(response)
```

## 📊 Response Format

### Tabular Response (Raw)
```json
{
  "columns": [
    { "name": "address", "type": "string" },
    { "name": "tvl_usd", "type": "number" }
  ],
  "data": [
    ["0x123...", 1000000],
    ["0x456...", 500000]
  ],
  "rows": 2
}
```

### Parsed Objects
```javascript
[
  { address: "0x123...", tvl_usd: 1000000 },
  { address: "0x456...", tvl_usd: 500000 }
]
```

## 🎓 Learning Path

1. **Start Here** → `QUICKSTART.md`
2. **Run Examples** → Try each example script
3. **Read Client** → Understand `src/client/cambrian-client.ts`
4. **Modify** → Change parameters in examples
5. **Create** → Write your own script
6. **Extend** → Add new client methods

## 🆘 Common Issues

### ❌ "Missing CAMBRIAN_API_KEY"
```bash
# Solution: Create .env file
echo "CAMBRIAN_API_KEY=your-key" > .env
```

### ❌ "Request failed 401"
```
Problem: Invalid API key
Solution: Check your API key in .env
```

### ❌ "Cannot find module"
```
Problem: Wrong import path
Solution: Add .js extension to imports
```

### ❌ "Command not found: pnpm"
```bash
# Solution: Install pnpm
npm install -g pnpm
```

## 📚 Documentation Index

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **README.md** | Complete documentation | First time |
| **QUICKSTART.md** | 2-minute setup | Getting started |
| **ARCHITECTURE.md** | Deep technical dive | Understanding internals |
| **PROJECT_SUMMARY.md** | What changed | Understanding restructure |
| **VISUAL_GUIDE.md** | Visual reference | Quick lookup |
| **agents.md** | API reference | Finding endpoints |

## 🔗 External Resources

- [Cambrian API Docs](https://docs.cambrian.org)
- [Get API Key](https://form.typeform.com/to/FlAoEzva)
- [OpenAPI Schema](https://opabinia.cambrian.network/openapi.json)
- [Discord Support](https://discord.com/channels/1375182661202481172/1376641098516271155)

---

**🎉 You're all set!** Start with `QUICKSTART.md` and explore the examples.
