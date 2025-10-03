import { describe, it, expect } from 'vitest';
import { chunkDocument, deduplicateChunks } from '../../../src/mastra/domains/meta-agent/requirements-collector/tools/websearch/meta-agent-chunker';

describe('chunkDocument', () => {
  it('splits long text into overlapping windows', () => {
    const text = 'A'.repeat(1200);
    const chunks = chunkDocument({ id: 'doc', url: 'http://x', text, title: 'T' }, { maxTokens: 400, overlap: 50 });
    expect(chunks.length).toBeGreaterThan(2);
    // Overlap ensures second chunk starts before end of first
    expect(chunks[1].content.startsWith('A'.repeat(50))).toBe(true);
  });
});

describe('deduplicateChunks', () => {
  it('keeps distinct chunks when prefixes differ', () => {
    const chunks = [
      { id: '1', url: 'u', title: 't', content: 'Alpha different start', ordinal: 0 },
      { id: '2', url: 'u', title: 't', content: 'Beta totally different start', ordinal: 1 },
    ];
    const deduped = deduplicateChunks(chunks as any);
    expect(deduped.length).toBe(2);
  });
});
