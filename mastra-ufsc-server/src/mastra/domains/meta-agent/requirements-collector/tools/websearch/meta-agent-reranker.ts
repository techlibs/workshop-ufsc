export interface RerankItem { id: string; content: string; score?: number; meta?: any; }
export interface RerankResult extends RerankItem { rank: number; finalScore: number; }

export interface Reranker { rerank(query: string, items: RerankItem[], topK: number): Promise<RerankResult[]>; }

export class NoopReranker implements Reranker {
  async rerank(_query: string, items: RerankItem[], topK: number): Promise<RerankResult[]> {
    return items.slice(0, topK).map((i, idx) => ({ ...i, rank: idx, finalScore: i.score ?? 0 }));
  }
}

export class CohereReranker implements Reranker {
  private model: string;
  constructor(model?: string) { this.model = model || process.env.COHERE_RERANK_MODEL || 'rerank-english-v3.0'; }
  async rerank(query: string, items: RerankItem[], topK: number): Promise<RerankResult[]> {
    const key = process.env.COHERE_API_KEY; if (!key) throw new Error('COHERE_API_KEY missing');
    const body = { query, documents: items.map(i => i.content), top_n: topK, model: this.model };
    const resp = await fetch('https://api.cohere.ai/v1/rerank', { method: 'POST', headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!resp.ok) throw new Error(`Cohere rerank error ${resp.status}`);
    const json: any = await resp.json();
    return json.results.map((r: any) => ({ id: items[r.index].id, content: items[r.index].content, rank: r.index, finalScore: r.relevance_score }));
  }
}

export function selectReranker(): Reranker {
  if (process.env.ENABLE_RERANK !== 'true') return new NoopReranker();
  const provider = (process.env.RERANK_PROVIDER || 'cohere').toLowerCase();
  switch (provider) {
    case 'cohere': return new CohereReranker();
    default: return new NoopReranker();
  }
}
