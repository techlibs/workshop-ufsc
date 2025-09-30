/**
 * Example: Get EVM current price for a token
 *
 * Run with:
 *   pnpm tsx src/examples/evm/evm-price-current.ts <TOKEN_ADDRESS> [chain_id]
 *
 * Example:
 *   pnpm tsx src/examples/evm/evm-price-current.ts 0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf 8453   # cbBTC on Base
 */

import { createClient } from "../../client/cambrian-client.js";
import { getApiKey, getBaseUrl } from "../../utils/env.js";

async function main() {
  const token = process.argv[2] ? process.argv[2] : "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf"; 
  const chainId = process.argv[3] ? parseInt(process.argv[3], 10) : 8453; // Default: Base

  if (!token) {
    console.error("❌ Missing token address");
    console.log("Usage: pnpm tsx src/examples/evm/evm-price-current.ts <TOKEN_ADDRESS> [chain_id]");
    process.exit(1);
  }

  console.log("🔍 Fetching EVM current price...");
  console.log(`   Token:    ${token}`);
  console.log(`   Chain ID: ${chainId}\n`);

  const client = createClient(getApiKey(), getBaseUrl());

  try {
    const price = await client.getEvmPrice(token, chainId);
    console.log("✅ Current price:");
    console.log(JSON.stringify(price, null, 2));
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

void main();


