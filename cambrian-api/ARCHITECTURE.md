# 🏗️ Project Architecture

## Overview

This project provides a clean, modular TypeScript client for the Cambrian API with separation of concerns and easy extensibility.

## Directory Structure

```
workshop-ufsc/
│
├── src/
│   │
│   ├── client/                    # Core API client library
│   │   ├── cambrian-client.ts    # Main client class with all API methods
│   │   └── types.ts              # Shared TypeScript types
│   │
│   ├── examples/                  # Runnable example scripts
│   │   ├── solana/
│   │   │   ├── latest-block.ts   # Example: Get latest Solana block
│   │   │   └── price-current.ts  # Example: Get token price
│   │   └── evm/
│   │       ├── evm-chains.ts              # Example: List EVM chains
│   │       ├── uniswap-v3-pools.ts        # Example: List Uniswap pools
│   │       └── uniswap-v3-pool-detail.ts  # Example: Get pool details
│   │
│   └── utils/                     # Shared utilities
│       └── env.ts                 # Environment variable helpers
│
├── .env                           # API key configuration (create this)
├── .gitignore                     # Git ignore rules
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
│
├── README.md                      # Full documentation
├── QUICKSTART.md                  # Quick start guide
├── ARCHITECTURE.md                # This file
├── agents.md                      # API endpoint reference
│
└── Legacy files:
    ├── cambrian.legacy.ts         # Old CLI implementation
    ├── README.old.md              # Old README
    ├── pedro-sample.md            # Sample file
    └── output.txt                 # Sample output
```

## Architecture Patterns

### 1. Client Layer (`src/client/`)

**Purpose:** Encapsulate all API communication logic

**Key Components:**
- `CambrianClient` class - Main API client
- Type definitions - Shared TypeScript types
- Response parsers - Convert tabular data to objects

**Benefits:**
- Single source of truth for API interactions
- Type-safe API calls
- Easy to extend with new endpoints
- Reusable across different scripts

### 2. Examples Layer (`src/examples/`)

**Purpose:** Demonstrate usage and serve as templates

**Pattern:**
```typescript
import { createClient } from "../../client/cambrian-client";
import { getApiKey } from "../../utils/env";

async function main() {
  const client = createClient(getApiKey());
  const result = await client.someMethod();
  console.log(result);
}

void main();
```

**Benefits:**
- Self-contained, runnable scripts
- Clear, focused examples
- Easy to copy and modify
- Organized by blockchain (solana/evm)

### 3. Utilities Layer (`src/utils/`)

**Purpose:** Shared helper functions

**Current Utilities:**
- Environment variable management
- API key validation

**Benefits:**
- DRY principle
- Consistent error handling
- Easy configuration

## Design Principles

### 1. Separation of Concerns
- **Client** handles API communication
- **Examples** demonstrate usage
- **Utils** provide shared functionality

### 2. Type Safety
- Full TypeScript support
- Typed API responses
- Compile-time error checking

### 3. Extensibility
Adding a new endpoint is straightforward:

```typescript
// In src/client/cambrian-client.ts
async getNewEndpoint(params: SomeParams) {
  return this.getObjects("/api/v1/new/endpoint", { params });
}

// Create example in src/examples/
// Run it: pnpm tsx src/examples/new-example.ts
```

### 4. Developer Experience
- Clear file organization
- Descriptive naming
- Comprehensive documentation
- Easy to run examples
- Quick start guide

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                     User Script                          │
│  (examples/solana/latest-block.ts)                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ createClient(apiKey)
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  CambrianClient                          │
│  - buildUrl()                                            │
│  - get()                                                 │
│  - tabularToObjects()                                   │
│  - getLatestBlock()                                     │
│  - getUniswapV3Pools()                                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP GET with API key
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Cambrian API                                │
│  https://opabinia.cambrian.network                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Tabular JSON response
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Response Parser                             │
│  tabularToObjects()                                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Array of objects
                     ▼
┌─────────────────────────────────────────────────────────┐
│                User Script                               │
│  console.log(results)                                   │
└─────────────────────────────────────────────────────────┘
```

## Adding New Features

### Add a new API endpoint

1. **Add method to client** (`src/client/cambrian-client.ts`):
```typescript
async getMyNewEndpoint(params: MyParams) {
  return this.getObjects("/api/v1/my/endpoint", { params });
}
```

2. **Create example** (`src/examples/category/my-example.ts`):
```typescript
const client = createClient(getApiKey());
const result = await client.getMyNewEndpoint({ ... });
console.log(result);
```

3. **Add npm script** (`package.json`):
```json
{
  "scripts": {
    "example:my:script": "tsx src/examples/category/my-example.ts"
  }
}
```

4. **Update documentation** (`README.md`):
- Add to available methods list
- Add usage example

## Testing Strategy

**Current Approach:** Example-driven development
- Each example serves as an integration test
- Run examples to verify functionality
- Easy to validate changes

**Future Enhancements:**
- Unit tests for client methods
- Mock API responses
- Automated test suite

## Configuration

**Environment Variables:**
- `CAMBRIAN_API_KEY` - Required API key
- `CAMBRIAN_BASE_URL` - Optional base URL override

**TypeScript:**
- Strict mode enabled
- Module: ES2022
- Target: ES2022

## Dependencies

**Runtime:**
- `dotenv` - Environment variable management

**Development:**
- `typescript` - Type checking and compilation
- `tsx` - TypeScript execution
- `@types/node` - Node.js type definitions

## Performance Considerations

1. **Client Reuse:** Create one client instance and reuse it
2. **Async/Await:** All API calls are async
3. **Type Safety:** Compile-time checks prevent runtime errors
4. **Minimal Dependencies:** Fast installation and startup

## Security Best Practices

1. **API Key Management:**
   - Never commit `.env` file
   - Use environment variables
   - Validate key on startup

2. **Type Safety:**
   - TypeScript prevents common errors
   - Compile-time validation

3. **Error Handling:**
   - Graceful error messages
   - No sensitive data in logs

## Future Enhancements

- [ ] Add more API endpoints (tokens, pools, trades, etc.)
- [ ] Implement request caching
- [ ] Add retry logic for failed requests
- [ ] Rate limiting support
- [ ] Batch request support
- [ ] WebSocket support for real-time data
- [ ] CLI tool with interactive mode
- [ ] Response type generation from OpenAPI spec
- [ ] Unit and integration tests
- [ ] Performance monitoring
