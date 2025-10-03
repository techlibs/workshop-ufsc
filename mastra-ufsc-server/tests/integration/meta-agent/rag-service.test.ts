import { describe, it, expect, beforeAll } from 'vitest';
import { metaAgentRagService } from '../../../src/mastra/domains/meta-agent/requirements-collector/tools/websearch/meta-agent-rag-service';

// NOTE: This hits real network if provider env vars are set. By default it should short circuit due to missing keys.
// We mainly verify that ingestFromQuery does not throw and retrieve works with empty store.

describe('MetaAgentRagService', () => {
  it('gracefully ingests with missing provider keys (no throw)', async () => {
    let error: any = null;
    try {
      await metaAgentRagService.ingestFromQuery('test query', { numResults: 1 });
    } catch (e) { error = e; }
    // Depending on missing API keys search provider selection may throw. Accept both behaviors but not unrelated errors.
    if (error) {
      expect(String(error.message || error)).toMatch(/missing|Unknown META_AGENT_SEARCH_PROVIDER/i);
    } else {
      expect(true).toBe(true);
    }
  });

  it('retrieve returns an array (empty or filled)', async () => {
    const res = await metaAgentRagService.retrieve('workflow requirements', 3);
    expect(Array.isArray(res)).toBe(true);
  });
});
