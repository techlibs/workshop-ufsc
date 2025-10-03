// Placeholder RAG store abstraction. In future integrate real vector store (e.g. chroma, pgvector, etc.)
// For now we keep documents in-memory and perform naive scoring.

export interface RAGDocument {
  id: string;
  content: string;
  source: string; // web:<url> | mastra:<path>
}

export class InMemoryRAGStore {
  private docs: RAGDocument[] = [];

  add(docs: RAGDocument[]) {
    for (const d of docs) {
      if (!this.docs.find(x => x.id === d.id)) this.docs.push(d);
    }
  }

  search(query: string, k = 5): { id: string; relevance: number; excerpt: string }[] {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const scored = this.docs.map(d => {
      const lc = d.content.toLowerCase();
      const hits = terms.reduce((acc, t) => acc + (lc.includes(t) ? 1 : 0), 0);
      const relevance = hits / (terms.length || 1);
      return { doc: d, relevance };
    });
    return scored
      .filter(s => s.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, k)
      .map(s => ({ id: s.doc.id, relevance: s.relevance, excerpt: s.doc.content.slice(0, 240) }));
  }
}

export const ragStore = new InMemoryRAGStore();
