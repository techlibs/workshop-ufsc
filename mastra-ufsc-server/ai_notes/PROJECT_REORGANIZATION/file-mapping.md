# File Migration Mapping

## Test Files (Root → tests/)

| Current Location | New Location | Status |
|-----------------|--------------|---------|
| test-beach-agent.ts | tests/e2e/beach-agent.e2e.ts | ⏳ |
| test-city-nickname.ts | tests/e2e/weather/city-nickname.e2e.ts | ⏳ |
| test-floripa.ts | tests/e2e/weather/floripa.e2e.ts | ⏳ |
| test-inventory-agent.ts | tests/e2e/inventory-agent.e2e.ts | ⏳ |
| test-loop-fix.ts | tests/integration/weather/loop-fix.spec.ts | ⏳ |
| test-movie-agent.ts | tests/e2e/movie-agent.e2e.ts | ⏳ |
| test-real-movie-data.ts | tests/e2e/movie/real-data.e2e.ts | ⏳ |
| test-study-agent.ts | tests/e2e/study-agent.e2e.ts | ⏳ |
| test-weather-workflow-logging.ts | tests/integration/weather/workflow-logging.spec.ts | ⏳ |
| __tests__/test-weather-integration.ts | tests/integration/weather/integration.spec.ts | ⏳ |
| __tests__/test-workflow-fix.ts | tests/integration/weather/workflow-fix.spec.ts | ⏳ |

## Domain Organization (src/mastra/ → src/mastra/domains/)

### Weather Domain
| Current | New | Status |
|---------|-----|---------|
| agents/weather-agent.ts | domains/weather/agent.ts | ⏳ |
| workflows/weather-workflow.ts | domains/weather/workflow.ts | ⏳ |
| tools/weather-tool.ts | domains/weather/tools/weather-tool.ts | ⏳ |
| tools/forecast-tool.ts | domains/weather/tools/forecast-tool.ts | ⏳ |
| utils/geocoding.ts | domains/weather/utils/geocoding.ts | ⏳ |
| utils/city-mapper.ts | domains/weather/utils/city-mapper.ts | ⏳ |

### Beach Domain
| Current | New | Status |
|---------|-----|---------|
| agents/beach-agent.ts | domains/beach/agent.ts | ⏳ |
| tools/search-beaches-tool.ts | domains/beach/tools/search-beaches-tool.ts | ⏳ |
| tools/beach-details-tool.ts | domains/beach/tools/beach-details-tool.ts | ⏳ |
| utils/beach-data.ts | domains/beach/data/beach-data.ts | ⏳ |

### Movie Domain
| Current | New | Status |
|---------|-----|---------|
| agents/movie-agent.ts | domains/movie/agent.ts | ⏳ |
| tools/search-movies-tool.ts | domains/movie/tools/search-movies-tool.ts | ⏳ |
| tools/get-movie-details-tool.ts | domains/movie/tools/get-movie-details-tool.ts | ⏳ |
| tools/recommend-by-mood-tool.ts | domains/movie/tools/recommend-by-mood-tool.ts | ⏳ |
| tools/manage-providers-tool.ts | domains/movie/tools/manage-providers-tool.ts | ⏳ |
| utils/mood-mapper.ts | domains/movie/utils/mood-mapper.ts | ⏳ |
| utils/provider-manager.ts | domains/movie/utils/provider-manager.ts | ⏳ |
| utils/movie-data.ts | domains/movie/utils/movie-data.ts | ⏳ |
| utils/external-api/movie-service.ts | domains/movie/services/movie-service.ts | ⏳ |
| utils/external-api/tmdb-api.ts | domains/movie/services/tmdb-api.ts | ⏳ |
| utils/external-api/justwatch-api.ts | domains/movie/services/justwatch-api.ts | ⏳ |

### Inventory Domain
| Current | New | Status |
|---------|-----|---------|
| agents/inventory-agent.ts | domains/inventory/agent.ts | ⏳ |
| tools/search-inventory-tool.ts | domains/inventory/tools/search-inventory-tool.ts | ⏳ |
| tools/add-to-cart-tool.ts | domains/inventory/tools/add-to-cart-tool.ts | ⏳ |
| tools/remove-from-cart-tool.ts | domains/inventory/tools/remove-from-cart-tool.ts | ⏳ |
| tools/view-cart-tool.ts | domains/inventory/tools/view-cart-tool.ts | ⏳ |
| utils/inventory-data.ts | domains/inventory/data/inventory-data.ts | ⏳ |
| utils/cart-manager.ts | domains/inventory/utils/cart-manager.ts | ⏳ |

### Study Domain
| Current | New | Status |
|---------|-----|---------|
| agents/study-agent.ts | domains/study/agent.ts | ⏳ |
| tools/ai-agent-concepts-tool.ts | domains/study/tools/ai-agent-concepts-tool.ts | ⏳ |
| tools/blockchain-concepts-tool.ts | domains/study/tools/blockchain-concepts-tool.ts | ⏳ |
| tools/learning-resources-tool.ts | domains/study/tools/learning-resources-tool.ts | ⏳ |
| tools/quiz-generator-tool.ts | domains/study/tools/quiz-generator-tool.ts | ⏳ |
| tools/study-plan-generator-tool.ts | domains/study/tools/study-plan-generator-tool.ts | ⏳ |

### DeFi Domain
| Current | New | Status |
|---------|-----|---------|
| agents/defi-agents.ts | domains/defi/agent.ts | ⏳ |
| tools/dexes-tool.ts | domains/defi/tools/dexes-tool.ts | ⏳ |

### Shared Utilities
| Current | New | Status |
|---------|-----|---------|
| utils/env.ts | shared/config/env.ts | ⏳ |
| utils/external-api/api-cache.ts | shared/api/api-cache.ts | ⏳ |
| utils/external-api/api-config.ts | shared/api/api-config.ts | ⏳ |
| utils/external-api/base-api-client.ts | shared/api/base-api-client.ts | ⏳ |

## Documentation (Root → docs/)

| Current | New | Status |
|---------|-----|---------|
| README.md | README.md (keep, update) | ⏳ |
| agents.md | docs/guides/agents-guide.md | ⏳ |
| README_BEACH_AGENT.md | docs/agents/beach-agent.md | ⏳ |
| README_INVENTORY_AGENT.md | docs/agents/inventory-agent.md | ⏳ |
| README_MOVIE_AGENT.md | docs/agents/movie-agent.md | ⏳ |
| README_REAL_MOVIE_DATA.md | docs/guides/real-movie-data.md | ⏳ |
| SETUP_ENV.md | docs/getting-started/environment-setup.md | ⏳ |
| docs/mastra.md | docs/guides/mastra-reference.md | ⏳ |
| docs/cursor_create_an_interactive_shopping_a.md | docs/guides/cursor-shopping-guide.md | ⏳ |

## Examples
| Current | New | Status |
|---------|-----|---------|
| examples/api-usage-example.ts | examples/weather/api-usage-example.ts | ⏳ |
| examples/real-movie-search.ts | examples/movie/real-movie-search.ts | ⏳ |

## AI Notes (Reorganize)
| Current | New | Status |
|---------|-----|---------|
| ai_notes/BEACH_AGENT/* | docs/development/ai-notes/implementations/beach-agent.md | ⏳ |
| ai_notes/MOVIE_AGENT/* | docs/development/ai-notes/implementations/movie-agent.md | ⏳ |
| ai_notes/INVENTORY_AGENT/* | docs/development/ai-notes/implementations/inventory-agent.md | ⏳ |
| ai_notes/STUDY_AGENT/* | docs/development/ai-notes/implementations/study-agent.md | ⏳ |
| ai_notes/*_FIX.md | docs/development/ai-notes/fixes/* | ⏳ |
| ai_notes/WORKFLOW_SYSTEM/* | docs/development/ai-notes/concepts/workflow-system.md | ⏳ |

