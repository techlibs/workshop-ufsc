/**
 * Example: Get Detailed Info for a Specific Uniswap V3 Pool
 * 
 * Run with: pnpm tsx src/examples/evm/uniswap-v3-pool-detail.ts <POOL_ADDRESS> [chain_id]
 * 
 * Examples:
 *   pnpm tsx src/examples/evm/uniswap-v3-pool-detail.ts 0x...        # Default: Base (8453)
 *   pnpm tsx src/examples/evm/uniswap-v3-pool-detail.ts 0x... 8453   # Base
 *   pnpm tsx src/examples/evm/uniswap-v3-pool-detail.ts 0x... 1      # Ethereum
 */

import { createClient } from "../../client/cambrian-client.js";
import { getApiKey, getBaseUrl } from "../../utils/env.js";

async function main() {
  const poolAddress = process.argv[2];
  const chainId = process.argv[3] ? parseInt(process.argv[3], 10) : 8453; // Default to Base

  if (!poolAddress) {
    console.error("❌ Missing pool address");
    console.log("\nUsage:");
    console.log("  pnpm tsx src/examples/evm/uniswap-v3-pool-detail.ts <POOL_ADDRESS> [chain_id]");
    console.log("\nExample:");
    console.log("  pnpm tsx src/examples/evm/uniswap-v3-pool-detail.ts 0x123... 8453");
    process.exit(1);
  }

  console.log(`🔍 Fetching pool details for: ${poolAddress}`);
  console.log(`   Chain ID: ${chainId}`);
  console.log();

  const client = createClient(getApiKey(), getBaseUrl());

  try {
    const results = await client.getUniswapV3Pool(poolAddress, chainId);
    const pool = results[0];

    if (!pool) {
      console.log("❌ No pool data found");
      return;
    }

    console.log("✅ Pool Details:");
    console.log(JSON.stringify(pool, null, 2));
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

void main();
