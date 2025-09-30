/**
 * Example: List EVM DEXes
 *
 * Run with:
 *   pnpm tsx src/examples/evm/evm-dexes.ts
 */

import { createClient } from "../../client/cambrian-client.js";
import { getApiKey, getBaseUrl } from "../../utils/env.js";

async function main() {
  const chainId = process.argv[2] ? parseInt(process.argv[2], 10) : 8453; // Default: Base

  console.log("🔍 Fetching EVM DEXes...\n");

  const client = createClient(getApiKey(), getBaseUrl());

  try {
    const dexes = await client.getEvmDexes(chainId);

    if (!dexes || dexes.length === 0) {
      console.log("❌ No DEXes found");
      return;
    }

    console.log(`✅ Found ${dexes.length} DEXes:\n`);
    dexes.forEach((dex: any, index: number) => {
      console.log(`${index + 1}. ${dex.name ?? dex.slug ?? "Unknown"}`);
      if (dex.slug) console.log(`   Slug:   ${dex.slug}`);
      if (dex.chains) console.log(`   Chains: ${Array.isArray(dex.chains) ? dex.chains.join(", ") : dex.chains}`);
      console.log();
    });
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

void main();


