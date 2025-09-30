/**
 * Example: Get Uniswap V3 Pools
 *
 * Run with: pnpm tsx src/examples/evm/uniswap-v3-pools.ts [chain] [limit]
 *
 * Examples:
 *   pnpm tsx src/examples/evm/uniswap-v3-pools.ts
 *   pnpm tsx src/examples/evm/uniswap-v3-pools.ts base 10
 */

import { createClient } from "../../client/cambrian-client.js";
import { getApiKey, getBaseUrl } from "../../utils/env.js";

async function main() {
  const chain = process.argv[2];
  const limit = process.argv[3] ? parseInt(process.argv[3], 10) : 10;

  console.log("🔍 Fetching Uniswap V3 pools...");
  if (chain) console.log(`   Chain: ${chain}`);
  console.log(`   Limit: ${limit}\n`);

  const client = createClient(getApiKey(), getBaseUrl());

  try {
    const pools = await client.getUniswapV3Pools({
      chain,
      limit,
      offset: 0,
    });

    if (!pools || pools.length === 0) {
      console.log("❌ No pools found");
      return;
    }

    console.log(`✅ Found ${pools.length} pools:\n`);

    pools.forEach((pool: any, index: number) => {
      console.log(`${index + 1}. Pool:`);

      // Display key fields (adjust based on actual API response)
      if (pool.address) console.log(`   Address:     ${pool.address}`);
      if (pool.token0 || pool.token0_symbol) {
        console.log(`   Token 0:     ${pool.token0_symbol ?? pool.token0}`);
      }
      if (pool.token1 || pool.token1_symbol) {
        console.log(`   Token 1:     ${pool.token1_symbol ?? pool.token1}`);
      }
      if (pool.fee || pool.fee_tier) {
        console.log(`   Fee:         ${pool.fee ?? pool.fee_tier}`);
      }
      if (pool.tvl_usd) {
        console.log(
          `   TVL (USD):   $${parseFloat(pool.tvl_usd).toLocaleString()}`
        );
      }
      if (pool.volume_24h) {
        console.log(
          `   Volume 24h:  $${parseFloat(pool.volume_24h).toLocaleString()}`
        );
      }
      console.log();
    });

    // Optionally show raw data for first pool
    console.log("📋 Sample raw data (first pool):");
    console.log(JSON.stringify(pools[0], null, 2));
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

void main();
