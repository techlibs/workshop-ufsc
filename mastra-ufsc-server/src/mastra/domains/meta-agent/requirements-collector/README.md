# Meta-Agent Requirements Collector

Experimental workflow that conducts an interview to collect structured requirements for generating a new Mastra workflow.

## Features (Current Status)
- Initialization from user query
- Requirement schema + dynamic pending tracking
- Judge agent to extract values from user answers
- Interviewer agent to ask next best question (placeholder single-pass; true suspend/resume pending)
- Context retriever + naive RAG store abstraction
- Web search tool (placeholder provider)
- MCP docs placeholder integration

## Planned Enhancements
- Real web search provider (SerpAPI / Tavily / Brave)
- True multi-turn suspend/resume loop integration
- Vector store integration (Chroma / pgVector) replacing in‑memory store
- Automatic mastra docs retrieval via MCP server
- Normalization + validation transforms per requirement type

## Usage (Pseudo)
```ts
import { metaAgentRequirementsCollectorWorkflow } from "domains/meta-agent/requirements-collector";

const run = await metaAgentRequirementsCollectorWorkflow.run({ input: { query: "Create a workflow that ingests RSS feeds and summarizes daily" } });
console.log(run.output);
```

## Environment
Currently no additional env vars; add search API keys once a real provider is implemented.

## JSON Output Shape
See `types.ts` `FinalRequirementsOutputSchema` for full contract; includes meta, requirements list, and selected contexts.

## Development Notes
- Extend `interviewIterationStep` into a loop with suspend/resume once mastra APIs available in repo for `.waitForEvent()` or equivalent.
- Replace placeholder MCP integration in `utils/mastraMcp.ts`.
