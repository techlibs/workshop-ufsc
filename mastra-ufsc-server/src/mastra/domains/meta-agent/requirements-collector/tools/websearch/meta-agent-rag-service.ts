import { selectSearchProvider } from './meta-agent-web-search-provider';
import { MetaAgentFetcher } from './meta-agent-fetcher';
import { chunkDocument, deduplicateChunks } from './meta-agent-chunker';
import { selectEmbeddingProvider } from './meta-agent-embeddings';
import { selectReranker } from './meta-agent-reranker';

interface RAGIngestResult { url: string; chunkCount: number; skipped?: string; }
interface RetrievedContextChunk { id: string; url: string; title?: string; content: string; score: number; }

// Minimal in-memory vector store fallback (cosine similarity) for dev until real backend wired.
interface MemoryVec { id: string; url: string; title?: string; content: string; vector: number[]; }

function cosine(a: number[], b: number[]): number { let dot = 0, na = 0, nb = 0; for (let i = 0; i < a.length && i < b.length; i++) { dot += a[i]*b[i]; na += a[i]*a[i]; nb += b[i]*b[i]; } return dot / (Math.sqrt(na)*Math.sqrt(nb) + 1e-9); }

export class MetaAgentRagService {
  private search = selectSearchProvider();
  private fetcher = new MetaAgentFetcher();
  private embed = selectEmbeddingProvider();
  private reranker = selectReranker();
  private memory: MemoryVec[] = [];

  async ingestFromQuery(query: string, opts: { numResults?: number } = {}): Promise<RAGIngestResult[]> {
    const results = await this.search.search(query, { num: opts.numResults || 5 });
    const pages = await this.fetcher.fetchAll(results.map(r => r.url));
    const ingest: RAGIngestResult[] = [];
    for (const p of pages) {
      if (!p.ok || !p.readableText) { ingest.push({ url: p.url, chunkCount: 0, skipped: p.error || 'no-readable-text' }); continue; }
      const chunks = deduplicateChunks(chunkDocument({ id: p.id, url: p.url, title: p.title, text: p.readableText }));
      // embed in batches (simple for now)
      const vectors = await this.embed.embed(chunks.map(c => ({ id: c.id, text: c.content, metadata: { url: c.url, title: c.title } })));
      for (const v of vectors) {
        this.memory.push({ id: v.id, url: v.metadata?.url, title: v.metadata?.title, content: v.text, vector: v.vector });
      }
      ingest.push({ url: p.url, chunkCount: chunks.length });
    }
    return ingest;
  }

  async retrieve(query: string, topK = 5): Promise<RetrievedContextChunk[]> {
    const [qVec] = await this.embed.embed([{ id: 'q', text: query }]);
    const scored = this.memory.map(m => ({ ...m, score: cosine(qVec.vector, m.vector) }));
    scored.sort((a, b) => b.score - a.score);
    const prelim = scored.slice(0, Math.max(topK * 3, topK));
    const reranked = await this.reranker.rerank(query, prelim.map(p => ({ id: p.id, content: p.content, score: p.score })), topK);
    const map = new Map(prelim.map(p => [p.id, p]));
    return reranked.map(r => ({ id: r.id, url: map.get(r.id)!.url, title: map.get(r.id)!.title, content: map.get(r.id)!.content, score: r.finalScore }));
  }
}

export const metaAgentRagService = new MetaAgentRagService();
