// Simple web search abstraction placeholder.
// In production you may plug SerpAPI, Tavily, Brave Search, or custom crawler.
// Keeping interface generic so tools/agents can call without caring about provider.
import crypto from "node:crypto";

export interface RawSearchResult {
  id: string;
  url: string;
  title: string;
  snippet?: string;
  raw?: any;
}

export interface WebSearchProvider {
  search(query: string, opts?: { num?: number }): Promise<RawSearchResult[]>;
}

// Naive placeholder provider (replace with real API integration)
export class PlaceholderSearchProvider implements WebSearchProvider {
  async search(query: string, opts?: { num?: number }): Promise<RawSearchResult[]> {
    const num = opts?.num ?? 3;
    // Returns deterministic mock data for now.
    return Array.from({ length: num }).map((_, i) => ({
      id: crypto.randomUUID(),
      url: `https://example.com/mock-${i + 1}?q=${encodeURIComponent(query)}`,
      title: `Mock result ${i + 1} for ${query}`,
      snippet: `This is a placeholder snippet for ${query}. Replace provider with real web search.`,
    }));
  }
}

// Basic cleaning / normalization
export function cleanText(input: string): string {
  return input
    .replace(/\s+/g, " ")
    .replace(/[\u0000-\u001F]/g, "")
    .trim();
}

export function extractRelevantSnippet(htmlOrText: string, max = 400): string {
  const text = cleanText(htmlOrText)
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "");
  return text.slice(0, max);
}
