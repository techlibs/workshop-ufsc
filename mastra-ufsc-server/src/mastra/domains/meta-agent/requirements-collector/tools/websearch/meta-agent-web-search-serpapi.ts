import crypto from 'node:crypto';
import type { MetaAgentWebSearchProvider, MetaAgentWebSearchProviderOptions, MetaAgentWebSearchResult } from './meta-agent-web-search-provider';

// SerpAPI universal search wrapper; simplest implementation uses "google" engine by default.

export class SerpApiSearchProvider implements MetaAgentWebSearchProvider {
  id = 'serpapi';

  private get apiKey() { const v = process.env.SERPAPI_KEY; if (!v) throw new Error('SERPAPI_KEY missing'); return v; }

  async search(query: string, opts: MetaAgentWebSearchProviderOptions = {}): Promise<MetaAgentWebSearchResult[]> {
    const num = opts.num ?? 5;
    const params = new URLSearchParams({ api_key: this.apiKey, engine: 'google', q: query, num: String(Math.min(num, 10)) });
    const resp = await fetch(`https://serpapi.com/search?${params.toString()}`);
    if (!resp.ok) throw new Error(`SerpAPI error ${resp.status}`);
    const json: any = await resp.json();
    const organic: any[] = json.organic_results || [];
    return organic.slice(0, num).map((r, idx) => ({
      id: crypto.createHash('sha1').update(r.link + idx).digest('hex'),
      url: r.link,
      title: r.title,
      snippet: r.snippet || r.snippet_highlighted_words?.join(' '),
      source: this.id,
      raw: process.env.DEBUG_SEARCH_RAW ? r : undefined,
    }));
  }
}
