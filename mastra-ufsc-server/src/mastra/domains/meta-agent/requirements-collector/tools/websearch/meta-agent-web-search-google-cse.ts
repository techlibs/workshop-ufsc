import crypto from 'node:crypto';
import type { MetaAgentWebSearchProvider, MetaAgentWebSearchProviderOptions, MetaAgentWebSearchResult } from './meta-agent-web-search-provider';

// Google Programmable Search (CSE): requires GOOGLE_CSE_KEY & GOOGLE_CSE_CX

export class GoogleCseSearchProvider implements MetaAgentWebSearchProvider {
  id = 'google-cse';

  private get key() { const v = process.env.GOOGLE_CSE_KEY; if (!v) throw new Error('GOOGLE_CSE_KEY missing'); return v; }
  private get cx() { const v = process.env.GOOGLE_CSE_CX; if (!v) throw new Error('GOOGLE_CSE_CX missing'); return v; }

  async search(query: string, opts: MetaAgentWebSearchProviderOptions = {}): Promise<MetaAgentWebSearchResult[]> {
    const num = opts.num ?? 5;
    const params = new URLSearchParams({ key: this.key, cx: this.cx, q: query, num: String(Math.min(num, 10)) });
    const resp = await fetch(`https://www.googleapis.com/customsearch/v1?${params.toString()}`);
    if (!resp.ok) throw new Error(`Google CSE error ${resp.status}`);
    const json: any = await resp.json();
    const items: any[] = json.items || [];
    return items.slice(0, num).map((r, idx) => ({
      id: crypto.createHash('sha1').update(r.link + idx).digest('hex'),
      url: r.link,
      title: r.title,
      snippet: r.snippet,
      source: this.id,
      raw: process.env.DEBUG_SEARCH_RAW ? r : undefined,
    }));
  }
}
