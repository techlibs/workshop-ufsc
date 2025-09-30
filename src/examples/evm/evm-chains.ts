/**
 * Example: List Supported EVM Chains
 * 
 * Run with: pnpm tsx src/examples/evm/evm-chains.ts
 */

import { createClient } from "../../client/cambrian-client.js";
import { getApiKey, getBaseUrl } from "../../utils/env.js";

async function main() {
  console.log("🔍 Fetching supported EVM chains...\n");

  const client = createClient(getApiKey(), getBaseUrl());

  try {
    const chains = await client.getEvmChains();

    if (!chains || chains.length === 0) {
      console.log("❌ No chains found");
      return;
    }

    console.log(`✅ Found ${chains.length} supported chains:\n`);

    chains.forEach((chain: any, index: number) => {
      console.log(`${index + 1}. ${chain.name ?? chain.chain_name ?? "Unknown"}`);
      if (chain.chain_id) console.log(`   Chain ID: ${chain.chain_id}`);
      if (chain.network) console.log(`   Network:  ${chain.network}`);
      console.log();
    });
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

void main();
