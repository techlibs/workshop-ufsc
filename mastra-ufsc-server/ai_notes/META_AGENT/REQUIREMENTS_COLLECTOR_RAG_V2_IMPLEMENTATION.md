# Requirements Collector – Web Search + RAG v2 Implementation

Date: 2025-10-03
Status: Completed (foundation in place, advanced enhancements pending)
Related Spec: `docs/development/prompts/meta-agent/requirements-collector-v2.0.md`
Previous Stage: `INITIAL_IMPLEMENTATION.md`
Branch: `feat/meta-agent-websearch`

---
## 1. Goal
Deliver real(ready) web search + page extraction + chunking + embeddings + (optional) reranking + retrieval as a Mastra capability for the Requirements Collector meta‑agent, wiring it into the workflow with an ingestion step and contextual retrieval to inform interview questions. Provide human‑in‑the‑loop readiness (placeholder suspend scaffold) and environment-driven provider selection.

## 2. Scope Implemented
| Capability | Implemented | Notes |
|------------|-------------|-------|
| Search Providers | Brave, Google CSE, SerpAPI stubs | Runtime selection via `META_AGENT_SEARCH_PROVIDER`; real calls require API keys. |
| Fetch + Robots | Yes | Rate limiting (Bottleneck), basic robots.txt allow check (naive parser), timeout & size limits. |
| Readability Extraction | Yes | `@mozilla/readability` with `jsdom` fallback to plain text. |
| Chunking & Dedup | Yes | Overlapping sliding window, prefix-based dedup heuristic. |
| Embeddings | OpenAI + identity fallback | OpenAI model `text-embedding-3-small` default; fallback deterministic when key absent (enables tests). |
| Vector Store | In-memory fallback | Pinecone/Weaviate adapter stubs created; not yet wired to real indices. |
| Retrieval + (Optional) Rerank | Yes | Cosine similarity + optional Cohere rerank (`ENABLE_RERANK`). |
| RAG Service Orchestrator | Yes | `MetaAgentRagService` handles ingest & retrieve; memory store. |
| Tool Exposure | Yes | `meta-agent-web-search` tool: `mode=ingest|retrieve`. Workflow currently calls service directly. |
| Workflow Integration | Partial (ingest + retrieval) | Suspend/resume placeholder comment; loop not yet event-driven. |
| Citations | Partial | Data structure extended; final output not yet populating citations list (future step). |
| MCP Docs Integration | Not added in this stage | To be integrated after stable RAG base. |
| Tests | Yes | Unit (chunker, embeddings), integration (RAG service basic). |

## 3. Architecture Realized
```
Query -> SearchProvider -> URL List -> Fetcher (robots+rate limit) -> Readability -> Chunker
      -> Embedding Provider -> In-memory Vector Store (placeholder) -> Retriever (cosine)
      -> (Optional) Reranker -> Context passed to workflow interview step
```
Future substitution points: Vector store layer (Pinecone / Weaviate), advanced rerankers, multi-modal embeddings.

## 4. Key Modules
| File | Purpose |
|------|---------|
| `meta-agent-web-search-provider.ts` | Provider selection & interface. |
| `meta-agent-web-search-*.ts` | Brave, Google CSE, SerpAPI implementations. |
| `meta-agent-fetcher.ts` | Fetch + readability + robots + limits. |
| `meta-agent-chunker.ts` | Chunk & dedup logic. |
| `meta-agent-embeddings.ts` | Embeddings abstraction + OpenAI + identity fallback. |
| `meta-agent-reranker.ts` | Cohere + noop reranker. |
| `meta-agent-rag-service.ts` | Orchestrates ingestion & retrieval pipeline. |
| `meta-agent-web-search-tool.ts` | Dual-mode ingest/retrieve tool. |
| `workflow.ts` | Added ingestion step + retrieval context before question generation. |
| `types.ts` | Extended with RAG context & citation schema. |

## 5. Environment Variables
```
# Provider selection
META_AGENT_SEARCH_PROVIDER=brave | google-cse | serpapi
BRAVE_API_KEY=...
GOOGLE_CSE_KEY=...
GOOGLE_CSE_CX=...
SERPAPI_KEY=...

# Rate limiting & robots
SEARCH_QPS=2
SEARCH_CONCURRENCY=4
ROBOTS_TTL_MIN=30

# Embeddings
EMBED_PROVIDER=openai | identity-test
OPENAI_API_KEY=...
OPENAI_EMBED_MODEL=text-embedding-3-small

# Reranking (optional)
ENABLE_RERANK=false
RERANK_PROVIDER=cohere
COHERE_API_KEY=...
COHERE_RERANK_MODEL=rerank-english-v3.0

# Vector store (future)
PINECONE_API_KEY=...
PINECONE_INDEX=meta-agent-reqs
WEAVIATE_URL=...
WEAVIATE_API_KEY=...

# Debug
DEBUG_SEARCH_RAW=false
```

## 6. Design Decisions & Trade-offs
- Chose static imports over dynamic `require` for providers to avoid test resolution issues in ESM/TS environments.
- In-memory vector store keeps iteration speed high; postpones external index complexity until retrieval semantics stable.
- Added deterministic embedding fallback to keep CI green without secrets, acknowledging production recall may differ.
- Reranking default disabled to minimize cost until baseline retrieval quality evaluated.
- Naive robots parsing acceptable for MVP; upgrade path: external robust parser (`robots-txt-parse`).
- Citations model defined early to avoid schema churn on later vector store migration.

## 7. Deviations from Spec
| Spec Item | Status | Rationale |
|-----------|--------|-----------|
| True suspend/resume loop | Deferred | Pending Mastra workflow API (`waitForEvent`) availability in repo. Placeholder comment added. |
| Pinecone/Weaviate full integration | Deferred | Complexity & credentials not yet provisioned; stubs isolate interface. |
| MCP docs integration | Deferred | RAG base prioritized; will extend ingestion to docs channel. |
| Rerank provider variety (Jina) | Partial | Only Cohere implemented first; add Jina later if needed. |

## 8. Testing Summary
| Test Type | Coverage |
|-----------|----------|
| Unit | chunker split/overlap, dedup heuristic, identity embeddings deterministic. |
| Integration | RAG ingestion (graceful with missing keys), retrieval fallback path. |
| Workflow | Basic run passes (existing workflow test). |
| Performance | Not formally benchmarked; small ingest expected < few seconds for 5 URLs (network dependent). |

All tests pass with fallback embedding; no external calls required for green state.

## 9. Open Risks / Follow-ups
1. Replace naive robots parsing (edge-case risk for complex directives).
2. Add exponential backoff + retry for transient fetch/status >= 500.
3. Implement persistent vector store (Pinecone/Weaviate) with namespace separation per session or query hash.
4. Add chunk-level source attribution into `requirements` sources for auditability.
5. Incorporate retrieval citations into final output assembly step.
6. Introduce telemetry (timings, success counts) into shared logging layer.
7. Secure API key handling via secret manager (currently environment only).
8. Consider batched provider search pagination (Brave next page token, SerpAPI start param) for deeper context when initial coverage insufficient.
9. Add LLM-based summarization of top retrieved chunks to reduce prompt footprint.
10. Integrate MCP Mastra docs ingestion + retrieval second channel (multi-vector index or metadata filtering).

## 10. Suggested Next Milestones
| Milestone | Description |
|-----------|-------------|
| M1 | Implement suspend/resume event loop for interview turns. |
| M2 | Production vector store migration (Pinecone) + persistence. |
| M3 | Citations & enriched final output (ragSelected sections with provider + URL). |
| M4 | MCP docs ingestion channel + hybrid retrieval. |
| M5 | Rerank quality evaluation & cost gating heuristics. |
| M6 | Observability: metrics & structured logs. |

## 11. Quick Usage Snippet
```ts
import { metaAgentRagService } from 'src/mastra/domains/meta-agent/requirements-collector/tools/websearch/meta-agent-rag-service';

await metaAgentRagService.ingestFromQuery('Create a workflow that ingests RSS feeds and summarizes daily');
const ctx = await metaAgentRagService.retrieve('RSS workflow summarization requirements', 5);
console.log(ctx.map(c => ({ id: c.id, score: c.score, preview: c.content.slice(0,120) })));
```

## 12. Validation Snapshot
- typecheck: PASS
- tests: PASS (4 files / 6 tests)
- no runtime secrets required for baseline dev pass

## 13. Changelog (This Stage)
- Added web search provider interfaces & three adapters.
- Implemented fetcher (robots, readability, limits) & chunker with overlap.
- Added embeddings abstraction + fallback.
- Added reranker abstraction + Cohere support.
- Added in-memory RAG service & tool integration.
- Extended workflow with ingestion & retrieval context injection.
- Updated schema (`types.ts`) and environment docs.
- Added unit/integration tests; CI-friendly fallback path.

---
Prepared by: Automated AI development agent
Purpose: Persist implementation knowledge for future contributors & next milestone alignment.
