/**
 * Example: List EVM tokens for a chain
 *
 * Run with:
 *   pnpm tsx src/examples/evm/evm-tokens.ts [chain_id]
 *
 * Example:
 *   pnpm tsx src/examples/evm/evm-tokens.ts 8453
 */

import { createClient } from "../../client/cambrian-client.js";
import { getApiKey, getBaseUrl } from "../../utils/env.js";

async function main() {
  const chainId = process.argv[2] ? parseInt(process.argv[2], 10) : 8453; // Default: Base

  console.log("🔍 Fetching EVM tokens...");
  console.log(`   Chain ID: ${chainId}\n`);

  const client = createClient(getApiKey(), getBaseUrl());

  try {
    const tokens = await client.getEvmTokens(chainId);
    if (!tokens || tokens.length === 0) {
      console.log("❌ No tokens found");
      return;
    }

    console.log(`✅ Found ${tokens.length} tokens (showing up to 50):\n`);
    tokens.forEach((t: any, index: number) => {
      console.log(`${index + 1}. ${t.symbol ?? t.address}`);
      if (t.address) console.log(`   Address: ${t.address}`);
      if (t.name) console.log(`   Name:    ${t.name}`);
      if (t.decimals !== undefined) console.log(`   Decimals: ${t.decimals}`);
      console.log();
    });

    console.log("📋 Sample raw data (first token):");
    console.log(JSON.stringify(tokens[0], null, 2));
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

void main();


