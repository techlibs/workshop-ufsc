/**
 * Example: Get Latest Solana Block
 * 
 * Run with: pnpm tsx src/examples/solana/latest-block.ts
 */

import { createClient } from "../../client/cambrian-client.js";
import { getApiKey, getBaseUrl } from "../../utils/env.js";

async function main() {
  console.log("🔍 Fetching latest Solana block...\n");

  const client = createClient(getApiKey(), getBaseUrl());
  
  try {
    const results = await client.getLatestBlock();
    const block = results[0];

    if (!block) {
      console.log("❌ No data returned");
      return;
    }

    // Handle different possible field names
    const blockNumber = block.blockNumber ?? block.blocknumber ?? block.block_height;
    const blockTime = block.blockTime ?? block.block_time ?? block.timestamp;
    const blockTimeIso = typeof blockTime === "number" 
      ? new Date(blockTime * 1000).toISOString()
      : blockTime;

    console.log("✅ Latest Block Info:");
    console.log(`   Block Number: ${blockNumber}`);
    console.log(`   Block Time:   ${blockTime}`);
    console.log(`   ISO Time:     ${blockTimeIso}`);
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

void main();
