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
Set the following to enable real web search + RAG (defaults fall back to in‑memory or no-op behaviors):

```
# Search Provider Selection
META_AGENT_SEARCH_PROVIDER=brave            # brave | google-cse | serpapi

# Provider Keys
BRAVE_API_KEY=...
GOOGLE_CSE_KEY=...
GOOGLE_CSE_CX=...
SERPAPI_KEY=...

# Fetch / Rate Limiting
SEARCH_QPS=2
SEARCH_CONCURRENCY=4
ROBOTS_TTL_MIN=30

# Embeddings
EMBED_PROVIDER=openai                       # openai | identity-test
OPENAI_API_KEY=...
OPENAI_EMBED_MODEL=text-embedding-3-small

# (Optional) Reranking
ENABLE_RERANK=false
RERANK_PROVIDER=cohere
COHERE_API_KEY=...
COHERE_RERANK_MODEL=rerank-english-v3.0

# Vector Stores (future backend wiring)
PINECONE_API_KEY=...
PINECONE_INDEX=meta-agent-reqs
WEAVIATE_URL=...
WEAVIATE_API_KEY=...

# Debug
DEBUG_SEARCH_RAW=false
```

If keys are absent the system still functions using memory-only storage and a failing search falls back early (tests tolerate this). Add production vector index integration when ready.

## JSON Output Shape
See `types.ts` `FinalRequirementsOutputSchema` for full contract; includes meta, requirements list, and selected contexts.

## Development Notes
- Extend `interviewIterationStep` into a loop with suspend/resume once mastra APIs available in repo for `.waitForEvent()` or equivalent.
- Replace placeholder MCP integration in `utils/mastraMcp.ts`.
