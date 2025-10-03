import { describe, it, expect } from 'vitest';
import { IdentityTestEmbeddingProvider } from '../../../src/mastra/domains/meta-agent/requirements-collector/tools/websearch/meta-agent-embeddings';

describe('IdentityTestEmbeddingProvider', () => {
  it('produces deterministic 4-dim vectors', async () => {
    const provider = new IdentityTestEmbeddingProvider();
    const res1 = await provider.embed([{ id: 'a', text: 'hello world' }]);
    const res2 = await provider.embed([{ id: 'a', text: 'hello world' }]);
    expect(res1[0].vector).toEqual(res2[0].vector);
    expect(res1[0].vector.length).toBe(4);
  });
});
