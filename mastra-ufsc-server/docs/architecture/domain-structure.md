# Domain Structure Guide

## Overview

Each domain in this project is a self-contained module containing all code related to a specific agent or feature area. This promotes:

- **Cohesion**: Related code stays together
- **Separation of Concerns**: Clear boundaries between features
- **Maintainability**: Easy to find and modify domain-specific logic
- **Scalability**: Domains can be extracted to separate packages

## Domain Template

```typescript
domain-name/
├── agent.ts              # Agent definition with instructions
├── workflow.ts           # Optional: Multi-step workflows
├── tools/                # Domain-specific tools
│   ├── tool-1.ts
│   ├── tool-2.ts
│   └── tool-3.ts
├── utils/                # Domain utilities
│   ├── helper-1.ts
│   └── helper-2.ts
├── data/                 # Static data or constants
│   └── domain-data.ts
├── services/             # External API integrations
│   └── external-service.ts
├── processors/           # Custom processors
│   └── custom-processor.ts
└── index.ts              # Barrel exports
```

## Import Patterns

### Within Domain (Relative Imports)
```typescript
// In tools/my-tool.ts
import { helperFunction } from "../utils/helpers";
import { staticData } from "../data/domain-data";
```

### Cross-Domain (Via Barrel Exports)
```typescript
// In another domain
import { agentName, toolName } from "../other-domain";
```

### Shared Utilities
```typescript
// Any domain can use shared utilities
import { getCacheTtl } from "../../shared/config/env";
import { ApiCache } from "../../shared/api/api-cache";
```

## Current Domains

### Weather (`domains/weather/`)
**Purpose**: Weather information and activity planning

**Components**:
- Agent: Weather assistant with multilingual support
- Workflow: Multi-step activity planning
- Tools: weather-tool, forecast-tool
- Utils: geocoding, city-mapper

### Beach (`domains/beach/`)
**Purpose**: Floripa beach recommendations

**Components**:
- Agent: Beach expert guide
- Tools: search-beaches-tool, beach-details-tool
- Data: Comprehensive beach database

### Movie (`domains/movie/`)
**Purpose**: Movie and series recommendations

**Components**:
- Agent: Movie recommendation assistant
- Tools: search, details, mood-based, provider management
- Services: TMDB API, JustWatch API, movie-service
- Utils: mood-mapper, provider-manager, movie-data

### Inventory (`domains/inventory/`)
**Purpose**: Shopping cart management

**Components**:
- Agent: Shopping assistant
- Tools: search, add-to-cart, remove-from-cart, view-cart
- Data: Product inventory
- Utils: cart-manager
- Processors: cart-summary-processor

### Study (`domains/study/`)
**Purpose**: Educational assistant for blockchain and AI

**Components**:
- Agent: Study assistant
- Tools: concept-explanation, study-plan, quiz-generator, resources

### DeFi (`domains/defi/`)
**Purpose**: DeFi and blockchain queries

**Components**:
- Agent: DeFi assistant
- Tools: dexes-tool

## Adding a New Domain

### Step 1: Create Structure
```bash
mkdir -p src/mastra/domains/my-domain/{tools,utils}
```

### Step 2: Create Agent
```typescript
// src/mastra/domains/my-domain/agent.ts
import { Agent } from "@mastra/core/agent";
import { myTool } from "./tools/my-tool";

export const myAgent = new Agent({
  name: "My Agent",
  // ... configuration
  tools: { myTool },
});
```

### Step 3: Create Tools
```typescript
// src/mastra/domains/my-domain/tools/my-tool.ts
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const myTool = createTool({
  id: "my-tool",
  description: "What this tool does",
  inputSchema: z.object({ /* ... */ }),
  outputSchema: z.object({ /* ... */ }),
  execute: async ({ context }) => {
    // Implementation
  },
});
```

### Step 4: Create Barrel Export
```typescript
// src/mastra/domains/my-domain/index.ts
export { myAgent } from "./agent";
export * from "./tools/my-tool";
```

### Step 5: Register in Main Index
```typescript
// src/mastra/index.ts
import { myAgent } from "./domains/my-domain";

export const mastra = new Mastra({
  agents: { myAgent, /* ... */ },
  // ...
});
```

## Best Practices

1. **Keep domains independent**: Avoid cross-domain imports except via barrel exports
2. **Use shared utilities**: Common code goes in `shared/`
3. **Export cleanly**: Use barrel exports (`index.ts`) for public API
4. **Document decisions**: Add comments explaining non-obvious patterns
5. **Test at domain level**: Each domain should have its own tests

## Refactoring Existing Code

When refactoring code into domains:

1. **Identify dependencies**: What does this code depend on?
2. **Move related code together**: Keep cohesive code in the same domain
3. **Update imports**: Use new relative paths
4. **Test thoroughly**: Ensure nothing breaks
5. **Update documentation**: Keep docs in sync

## Shared vs Domain Code

**Domain code**: Specific to one agent/feature
**Shared code**: Used by 2+ domains

Examples:
- ✅ Shared: API cache, environment config, base API client
- ✅ Domain: Beach data, movie mood-mapper, cart manager

