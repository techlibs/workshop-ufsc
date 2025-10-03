import crypto from 'node:crypto';
import type { MetaAgentWebSearchProvider, MetaAgentWebSearchProviderOptions, MetaAgentWebSearchResult } from './meta-agent-web-search-provider';

// Brave Search API reference: https://api.search.brave.com/app/documentation/web-search
// We keep implementation minimal; pagination & verticals can be added later.

export class BraveSearchProvider implements MetaAgentWebSearchProvider {
  id = 'brave';

  private get apiKey() {
    const key = process.env.BRAVE_API_KEY;
    if (!key) throw new Error('BRAVE_API_KEY missing');
    return key;
  }

  async search(query: string, opts: MetaAgentWebSearchProviderOptions = {}): Promise<MetaAgentWebSearchResult[]> {
    const num = opts.num ?? 5;
    const params = new URLSearchParams({ q: query, count: String(Math.min(num, 20)) });
    const resp = await fetch(`https://api.search.brave.com/res/v1/web/search?${params.toString()}`, {
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': this.apiKey,
      },
    });
    if (!resp.ok) throw new Error(`Brave search error ${resp.status}`);
    const json: any = await resp.json();
    const webResults: any[] = json.web?.results || [];
    return webResults.slice(0, num).map((r, idx) => ({
      id: crypto.createHash('sha1').update(r.url + idx).digest('hex'),
      url: r.url,
      title: r.title,
      snippet: r.description,
      score: r.rank, // Brave returns rank
      source: this.id,
      raw: process.env.DEBUG_SEARCH_RAW ? r : undefined,
    }));
  }
}
