// Simple facade re-exporting fetcher readability for future separation if needed.
// For now, readability handled inside fetcher; this file could host advanced cleaning transforms.

export function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}
