import crypto from 'node:crypto';

export interface EmbeddingInput { id: string; text: string; metadata?: Record<string, any>; }
export interface EmbeddingVector extends EmbeddingInput { vector: number[]; }

export interface EmbeddingProvider {
  embed(batch: EmbeddingInput[]): Promise<EmbeddingVector[]>;
  dimensions(): number;
}

export class OpenAIEmbeddingProvider implements EmbeddingProvider {
  private model: string;
  constructor(model?: string) { this.model = model || process.env.OPENAI_EMBED_MODEL || 'text-embedding-3-small'; }
  dimensions(): number { return 1536; } // Approx for small model; ideally fetch via model metadata.
  async embed(batch: EmbeddingInput[]): Promise<EmbeddingVector[]> {
    const key = process.env.OPENAI_API_KEY; if (!key) {
      // Dev/test fallback: deterministic identity embedding provider when key absent.
      const fallback = new IdentityTestEmbeddingProvider();
      return fallback.embed(batch);
    }
    // Minimal fetch without external SDK to keep deps slim here (sdk already present but explicit call ok)
    const body = { input: batch.map(b => b.text), model: this.model };
    const resp = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!resp.ok) throw new Error(`OpenAI embed error ${resp.status}`);
    const json: any = await resp.json();
    return json.data.map((d: any, i: number) => ({ ...batch[i], vector: d.embedding }));
  }
}

export class IdentityTestEmbeddingProvider implements EmbeddingProvider {
  dimensions(): number { return 4; }
  async embed(batch: EmbeddingInput[]): Promise<EmbeddingVector[]> { return batch.map(b => ({ ...b, vector: this.hashToVec(b.text) })); }
  private hashToVec(t: string): number[] { const h = crypto.createHash('sha1').update(t).digest(); return [h[0], h[1], h[2], h[3]].map(v => v / 255); }
}

export function selectEmbeddingProvider(): EmbeddingProvider {
  const provider = (process.env.EMBED_PROVIDER || 'openai').toLowerCase();
  if (provider === 'openai') return new OpenAIEmbeddingProvider();
  if (provider === 'identity-test') return new IdentityTestEmbeddingProvider();
  throw new Error(`Unsupported EMBED_PROVIDER ${provider}`);
}
