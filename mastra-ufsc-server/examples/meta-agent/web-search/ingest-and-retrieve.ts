#!/usr/bin/env tsx
import 'dotenv/config';
/**
 * Meta-Agent Web Search + RAG Example: Ingest and Retrieve
 *
 * Demonstrates:
 * 1. Ingesting web search results for a query (search -> fetch -> readability -> chunk -> embed)
 * 2. Retrieving top contextual chunks for a follow-up query
 * 3. Running without external API keys (falls back to identity embeddings and may skip search if keys absent)
 *
 * Usage:
 *   pnpm tsx examples/meta-agent/web-search/ingest-and-retrieve.ts "Build a workflow to summarize RSS feeds daily"
 */
import { metaAgentRagService } from '../../../src/mastra/domains/meta-agent/requirements-collector/tools/websearch/meta-agent-rag-service';

async function main() {
  const query = process.argv.slice(2).join(' ') || 'Design a workflow that tracks crypto prices and alerts on volatility';
  console.log('\n[Meta-Agent RAG] Ingesting query:', query);

  try {
    const ingest = await metaAgentRagService.ingestFromQuery(query, { numResults: 5 });
    console.log('\nIngestion summary:');
    for (const i of ingest) {
      console.log(`- ${i.url} :: chunks=${i.chunkCount}${i.skipped ? ' (skipped: ' + i.skipped + ')' : ''}`);
    }
  } catch (e: any) {
    console.warn('Ingestion encountered an error (expected if no API keys set):', e.message);
  }

  console.log('\n[Meta-Agent RAG] Retrieving contextual chunks...');
  const contexts = await metaAgentRagService.retrieve(query, 5);
  for (const c of contexts) {
    console.log(`\n> Chunk ${c.id} (score=${c.score.toFixed(3)})`);
    console.log(c.content.slice(0, 220) + (c.content.length > 220 ? '...' : ''));
  }

  console.log('\nDone.');
}

main().catch(e => { console.error(e); process.exit(1); });
