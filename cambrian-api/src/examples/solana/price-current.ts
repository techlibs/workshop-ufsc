/**
 * Example: Get Current Price for a Solana Token
 * 
 * Run with: pnpm tsx src/examples/solana/price-current.ts <TOKEN_MINT_ADDRESS>
 */

import { createClient } from "../../client/cambrian-client.js";
import { getApiKey, getBaseUrl } from "../../utils/env.js";

async function main() {
  const tokenMint = process.argv[2];

  if (!tokenMint) {
    console.error("❌ Missing token mint address");
    console.log("\nUsage:");
    console.log("  pnpm tsx src/examples/solana/price-current.ts <TOKEN_MINT_ADDRESS>");
    console.log("\nExample:");
    console.log("  pnpm tsx src/examples/solana/price-current.ts So11111111111111111111111111111111111111112");
    process.exit(1);
  }

  console.log(`🔍 Fetching price for token: ${tokenMint}\n`);

  const client = createClient(getApiKey(), getBaseUrl());

  try {
    const results = await client.getCurrentPrice(tokenMint);
    const price = results[0];

    if (!price) {
      console.log("❌ No price data found");
      return;
    }

    console.log("✅ Current Price Info:");
    console.log(JSON.stringify(price, null, 2));
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

void main();
