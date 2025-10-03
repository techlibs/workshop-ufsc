// Base interface and shared types for meta-agent web search providers.
// Real providers (Brave, Google CSE, SerpAPI) implement this contract.
// Keep output minimal & normalized so downstream RAG pipeline stays provider-agnostic.

export interface MetaAgentWebSearchResult {
  id: string;            // Stable unique id (hash of url+position ideally)
  url: string;
  title: string;
  snippet?: string;      // Provider snippet if supplied
  score?: number;        // Provider relevance score if available
  source: string;        // Provider identifier e.g. 'brave', 'google-cse', 'serpapi'
  raw?: unknown;         // Raw provider payload (debug only – avoid storing long-term)
}

export interface MetaAgentWebSearchProviderOptions {
  num?: number;          // Desired number of results (provider may return fewer)
  lang?: string;         // Optional language/locale code
  freshnessDays?: number;// Optional recency constraint if provider supports
}

export interface MetaAgentWebSearchProvider {
  id: string; // provider id string used in env selection
  search(query: string, opts?: MetaAgentWebSearchProviderOptions): Promise<MetaAgentWebSearchResult[]>;
}

export class UnsupportedSearchProviderError extends Error {}

import { BraveSearchProvider } from './meta-agent-web-search-brave';
import { GoogleCseSearchProvider } from './meta-agent-web-search-google-cse';
import { SerpApiSearchProvider } from './meta-agent-web-search-serpapi';

export function selectSearchProvider(): MetaAgentWebSearchProvider {
  const provider = process.env.META_AGENT_SEARCH_PROVIDER?.trim().toLowerCase() || 'brave';
  switch (provider) {
    case 'brave': return new BraveSearchProvider();
    case 'google-cse': return new GoogleCseSearchProvider();
    case 'serpapi': return new SerpApiSearchProvider();
    default: throw new UnsupportedSearchProviderError(`Unknown META_AGENT_SEARCH_PROVIDER: ${provider}`);
  }
}
