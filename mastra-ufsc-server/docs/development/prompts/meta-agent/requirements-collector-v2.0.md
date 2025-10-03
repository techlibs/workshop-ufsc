# Creating a mastra workflow requirement collector agent

This request is part of a larger workflow: a meta-agent workflow.

A meta-agent is an AI agent written using mastra framework that creates other mastra based workflows.

## Context

Read [INITIAL_IMPLEMENTATION](mastra-ufsc-server/ai_notes/META_AGENT/INITIAL_IMPLEMENTATION.md) to get the context of the current stage of the mastra workflow requirement collector agent development.

# requirements-collector-v2.0.md (Completed)

## Your task's description

**Goal.** Implement **real web search + web content extraction + RAG** as a **Mastra workflow capability** used by the Requirements Collector meta-agent. The feature must: (1) accept a user query, (2) search the public web using a production API, (3) fetch + clean + chunk result pages, (4) embed & index retrieved chunks, (5) retrieve + (optionally) rerank for the current user turn, and (6) expose this context to the **three-step requirements collector workflow** with **human-in-the-loop suspend/resume** per v1.0 (interview start → iterative interview → interview end).

> Why: v1.0 mandates real web search + MCP docs access + RAG; the current implementation still uses placeholders (fake search, no vector DB, no true suspend/resume). This task delivers those missing pieces and correctly chains the workflow.

---

### A. Architecture (high level)

```
User query
   └─► SearchProvider (Brave / Google CSE / SerpAPI)
         └─► URL queue (rate-limited, robots-aware)
               └─► Fetcher (Axios/Playwright) + Readability cleaner
                     └─► Chunker (overlap windows, dedup)
                           └─► Embeddings Service (OpenAI/Vertex)
                                 └─► Vector Store (Pinecone / Weaviate)
                                       └─► Retriever (+ optional reranker)
                                             └─► Mastra Workflow Step uses context
                                                   └─► suspend()/resume() for HIL
```

- **Search options (must support production scale):**
  - **Brave Search API** (first-class web API, generous verticals).
  - **Google Programmable Search JSON API (CSE)** (requires engine setup; limited global web coverage unless configured).
  - **SerpAPI** (handles proxies/CAPTCHAs; multi-engine; mature TS client).
  - **Do _not_ select** Bing v7 for **new** builds (self-serve shutdown announced Aug 2025).

- **HTML extraction & cleaning:** `@mozilla/readability` + `jsdom`.

- **Rate-limit & concurrency:** `bottleneck` for QPS limits; `p-limit` for in-process concurrency.

- **Robots.txt compliance:** a Node robots parser (e.g., `robots-txt-parser` or `@flyyer/robotstxt`).

- **Embeddings & Vector Store (server-side TS):**
  - **OpenAI embeddings** (production default); **Vertex AI** as cloud-portable alt.
  - **Pinecone** (official TS SDK) **or** **Weaviate** (official JS/TS client).

- **(Optional) Reranking:** **Cohere Rerank** or **Jina Reranker**.

- **Mastra workflow HIL:** implement **suspend/resume** at the interview step.

- **MCP (Mastra docs access):** connect to an **MCP server** for Mastra docs/tools context during interviews.

---

### B. Deliverables & file layout

```
src/mastra/domains/meta-agent/requirements-collector/tools/websearch
├── meta-agent-web-search-provider.ts
├── meta-agent-web-search-brave.ts
├── meta-agent-web-search-google-cse.ts
├── meta-agent-web-search-serpapi.ts
├── meta-agent-fetcher.ts
├── meta-agent-readability.ts
├── meta-agent-chunker.ts
├── meta-agent-embeddings.ts
├── meta-agent-vectorstore-pinecone.ts
├── meta-agent-vectorstore-weaviate.ts
├── meta-agent-reranker.ts
├── meta-agent-rag-service.ts
├── meta-agent-web-search-tool.ts
src/mastra/domains/meta-agent/requirements-collector/
├── workflow.ts         // corrected chaining; true HIL loop
└── types.ts
```

---

### C. Implementation plan (step-by-step, with acceptance criteria)

(…content as described in previous message: SearchProvider, Robots guard, Fetcher + cleaner, Chunking, Embeddings, Vector store, Retrieval + rerank, RAG service surface, Workflow HIL, MCP integration, Observability, Compliance…)

---

### D. Tests & acceptance scenarios

1. **Unit tests**: adapters, readability cleaner, robots guard, embeddings/vectorstore stubs, reranker adapter.
2. **Integration (happy path)**: multi-turn HIL with real RAG context.
3. **Integration (edge)**: rate limits, 429 retries, no unhandled errors.
4. **Performance**: 10 URLs ingested and indexed in <8s p50.

---

### E. Configuration matrix (env)

- `META_AGENT_SEARCH_PROVIDER=brave|google-cse|serpapi`
- `BRAVE_API_KEY`, `GOOGLE_CSE_KEY`, `GOOGLE_CSE_CX`, `SERPAPI_KEY`
- `SEARCH_QPS`, `SEARCH_CONCURRENCY`
- `ROBOTS_TTL_MIN`
- `ENABLE_HEADLESS`
- `EMBED_PROVIDER=openai|vertex`
- `VECTOR_BACKEND=pinecone|weaviate`
- `ENABLE_RERANK`, `RERANK_PROVIDER`

---

### F. Notes on trade-offs

- Brave is strong default; CSE requires config; SerpAPI is robust but costly.
- Bing deprecated.
- Readability outperforms naive `<p>` scraping.
- Rerank improves quality but adds cost.
- Suspend/resume loop mandatory.

---

### G. Definition of Done (DoD)

- All components implemented, tested, and wired to the workflow.
- Workflow loops with suspend/resume.
- MCP docs available.
- Outputs include citations.

## Naming pattern

Name specific features and files for this project with a starting meta-agent-*, since this will further grow to include other workflow features, like plan designer and workflow developer.

Put the core of the requirements collect feature un src/mastra/domains/meta-agent/requirements-collector

## Development process

- Always proceed as instructed in [agents.md](../../../../../mastra-ufsc-server/agents.md).
- Use web search tools to find out how to implement a real web search engine using typescript.
- Consult mastra mcp server in every stage of development.