export interface Chunk {
  id: string;
  url: string;
  title?: string;
  content: string;
  ordinal: number;
}

export interface ChunkerOptions { maxTokens?: number; overlap?: number; minChars?: number; }

export function chunkDocument(doc: { id: string; url: string; title?: string; text: string }, opts: ChunkerOptions = {}): Chunk[] {
  const max = opts.maxTokens ?? 800; // approximate tokens ~ chars/4 (we treat as chars window)
  const overlap = opts.overlap ?? 120;
  const minChars = opts.minChars ?? 200;
  const text = doc.text.trim().replace(/\s+/g, ' ');
  const chunks: Chunk[] = [];
  if (!text) return chunks;
  let start = 0, ordinal = 0;
  while (start < text.length) {
    const end = Math.min(start + max, text.length);
    let slice = text.slice(start, end);
    if (slice.length < minChars && start !== 0) break; // ignore tiny tail
    chunks.push({ id: `${doc.id}-${ordinal}`, url: doc.url, title: doc.title, content: slice, ordinal });
    ordinal++;
    if (end === text.length) break;
    start = end - overlap; // overlap window
  }
  return chunks;
}

export function deduplicateChunks(chunks: Chunk[]): Chunk[] {
  const seen = new Set<string>();
  const out: Chunk[] = [];
  for (const c of chunks) {
    const key = c.content.slice(0, 200); // prefix-based heuristic
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c);
  }
  return out;
}
