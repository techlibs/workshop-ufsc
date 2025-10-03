# Mastra UFSC Server – Agent Handbook

This handbook captures how agents are organised and extended inside `mastra-ufsc-server`. For framework specifics, keep the Mastra reference in `docs/mastra.md` open while you work.

## Repository Layout

```text
src/mastra/
├── domains/             # Feature-specific agent domains (one folder per agent)
│   ├── beach/           # Beach concierge agent (tools, data, agent, barrel)
│   ├── defi/            # DeFi market intelligence agent
│   ├── inventory/       # Shopping assistant agent with cart utilities
│   ├── movie/           # Streaming recommendations agent
│   ├── study/           # Blockchain & AI tutor agent
│   └── weather/         # Weather + activity planning agent
├── shared/              # Cross-domain utilities (API clients, env config, logging)
├── index.ts             # Mastra root configuration (registers agents, workflows)
└── workflows/           # Legacy orchestration helpers (new flows live in domains)
```

Each domain follows the same internal shape so changes remain predictable:

```text
<domain>/
├── agent.ts             # Agent definition & instructions
├── data/                # Static datasets (optional)
├── services/            # External API integrations (optional)
├── tools/               # createTool definitions exposed to the agent
├── utils/               # Domain-only helpers
├── workflow.ts          # Domain workflow (optional, commit() inside file)
└── index.ts             # Barrel exports for Mastra registration
```

## Domain Reference

| Domain | Purpose | Key Entry Points | Documentation |
| --- | --- | --- | --- |
| `weather/` | Weather checks & day planning | `agent.ts`, `workflow.ts` | `docs/agents/weather-agent.md` |
| `beach/` | Floripa beach concierge | `agent.ts`, `tools/search-beaches-tool.ts` | `docs/agents/beach-agent.md` |
| `movie/` | Mood + provider-based recommendations | `agent.ts`, `utils/mood-mapper.ts` | `docs/agents/movie-agent.md` |
| `inventory/` | Conversational shopping & cart | `agent.ts`, `utils/cart-manager.ts` | `docs/agents/inventory-agent.md` |
| `study/` | Blockchain & AI tutor | `agent.ts`, `tools/study-plan-generator-tool.ts` | `docs/agents/study-agent.md` |
| `defi/` | DeFi protocol Q&A (alpha) | `agent.ts`, `tools/dexes-tool.ts` | `docs/architecture/project-overview.md` |

## Shared Modules

- `shared/api/` – API client wrappers, caching, and retry policies.
- `shared/config/env.ts` – Runtime configuration loader (also see `env.example`).  DO NOT use process.env.XXX directly in domain code ALWAYS create getter function in shared/config/env.ts
- `types/` – Cross-domain TypeScript contracts.
- `tests/` – E2E and integration suites organised by domain (`tests/e2e/<domain>`).
- `examples/` – Minimal scripts demonstrating agent usage.

Reuse helpers from `shared/` or create new ones when two or more domains need the same behaviour. Keep domain-specific logic inside the matching `domains/<name>` folder.

## Implementation Workflow

1. **Plan & Document** – Capture the intent in `docs/development/ai-notes/` (follow the 4-phase workflow outlined in `docs/development/plans/AI_WORKFLOW_SYSTEM.md`).
2. **Add Tools First** – Define tool schemas and behaviour inside the domain's `tools/` folder and export them through `index.ts`.
3. **Wire the Agent** – Configure instructions, model, tools, workflows, memory, and optional processors in `agent.ts`.
4. **Design the Workflow** – When orchestration is required, create a `workflow.ts` inside the domain:
   - Use `createStep` for reusable units with clear input/output schemas (Zod) and retry/backoff policies when needed.
   - Chain steps with `.then()`, `.parallel()`, `.branch()` to express the desired control flow.
   - Pass domain tools or other agents using the provided `mastra` context—never call the parent agent from within the workflow unless you wrap it with explicit safeguards (see `docs/development/ai-notes/fixes/workflow-loop-prevention.md`).
   - Commit the workflow with `.commit()` at the bottom of the file and export it through the domain barrel.
5. **Register in Mastra** – Import new agents/workflows in `src/mastra/index.ts` so they are available to the runtime, tests, and dev playground.
6. **Document & Test** – Update the relevant doc in `docs/agents/`, add usage examples, and extend E2E/integration tests under `tests/`.

### Workflow Implementation Guide

When authoring workflows, follow these AI-friendly instructions so Mastra can reason about tool orchestration reliably:

- **Purpose** – Start by describing the workflow goal, required context, and expected outputs in plain language comments; this guides downstream agents.
- **Step Construction** – Encapsulate external API calls and heavy logic inside steps. Keep side effects inside the `execute` function and return structured data only.
- **Context Sharing** – Use the workflow context to pass data between steps; avoid global state or hidden mutations.
- **Error Handling** – Configure `retryConfig` or explicit `try/catch` blocks so transient failures (network, rate limits) can be retried without breaking the run.
- **Human-in-the-Loop** – Use `.waitForEvent()` or branching to request manual approval when a decision cannot be automated.
- **Agent Calls from Workflows** – If a step invokes an agent, add a system instruction that forbids further tool/workflow calls and keeps the response focused (see the weather workflow for a reference pattern).
- **Testing** – Create fixture-driven integration tests in `tests/integration/<domain>` exercising success, retry, and failure paths.

### Best Practices Summary

- Use clear tool descriptions and Zod schemas so LLMs call the right capabilities.
- Keep agent instructions concise but explicit about tool/workflow selection rules.
- Extract business logic into custom hooks/utilities (`docs/mastra.md` + `.cursorrules` guidance).
- Persist conversational memory with LibSQL and prune when necessary.
- Avoid circular workflow/tool invocation—see `docs/development/ai-notes/fixes/workflow-loop-prevention.md`.

## Additional Resources

- Mastra Framework Reference: `docs/mastra.md`
- Agent Patterns & Notes: `docs/development/ai-notes/concepts/agent-patterns.md`
- Workflow Architecture: `docs/architecture/domain-structure.md`
- Environment Setup: `docs/getting-started/environment-setup.md`

Stay consistent with this handbook to keep agents predictable, testable, and easy to extend.