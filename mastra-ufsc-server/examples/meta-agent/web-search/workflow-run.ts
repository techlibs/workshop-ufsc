#!/usr/bin/env tsx
import 'dotenv/config';
/**
 * Meta-Agent Requirements Collector Workflow Example
 *
 * Demonstrates running the requirements collector workflow end-to-end with initial
 * context ingestion (web search + RAG) already wired into the workflow pipeline.
 *
 * NOTE:
 *  - Current workflow version performs a single pass (no true suspend/resume yet).
 *  - Web search ingestion may partially fail without provider API keys; this is tolerated.
 *  - Embeddings fallback (identity) keeps the example functional in offline dev.
 *
 * Usage:
 *   pnpm tsx examples/meta-agent/web-search/workflow-run.ts "Create a workflow that processes GitHub issues and summarizes them weekly"
 */
import { runMetaAgentRequirementsCollector } from '../../../src/mastra/domains/meta-agent/requirements-collector/workflow';

async function run() {
  const query = process.argv.slice(2).join(' ') || 'Generate a workflow that fetches RSS feeds and summarizes daily';
  console.log('\n[Workflow] Starting requirements collection for query:');
  console.log(query);

  const output = await runMetaAgentRequirementsCollector({ query });
  console.log('\n[Workflow] Final Output Meta:');
  console.log(output.meta);

  console.log('\n[Workflow] Requirements (id -> value/confidence):');
  for (const r of output.requirements) {
    console.log(`- ${r.id}: value=${JSON.stringify(r.value)} confidence=${r.confidence ?? 'n/a'}`);
  }

  console.log('\n[Workflow] RAG Selected (if any):');
  for (const c of output.contexts.ragSelected) {
    console.log(`- ${c.id} relevance=${c.relevance} excerpt="${c.excerpt.slice(0,80)}..."`);
  }

  console.log('\nDone.');
}

run().catch(e => { console.error(e); process.exit(1); });
