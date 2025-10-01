import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getCambrianApiKey, getCambrianBaseUrl } from "../../../shared/config/env";

export const priceCurrentTool = createTool({
  id: "price-current",
  description:
    "Get current token price from Cambrian API for a given token address and chain_id (default 8453).",
  inputSchema: z.object({
    address: z
      .string()
      .describe("Token contract address (checksummed) for EVM chain"),
    chain_id: z
      .number()
      .int()
      .optional()
      .describe("EVM chain id. Defaults to 8453 (Base)."),
  }),
  outputSchema: z.object({
    address: z.string(),
    chain_id: z.number(),
    price_usd: z.number().optional(),
    price_native: z.number().optional(),
    symbol: z.string().optional(),
    name: z.string().optional(),
    raw: z.any().optional(),
  }),
  execute: async ({ context }) => {
    const baseUrl = getCambrianBaseUrl() ?? "https://opabinia.cambrian.network";
    const url = new URL("/api/v1/evm/price-current", baseUrl);
    const chainId = context?.chain_id ?? 8453;
    url.searchParams.set("token_address", String(context.address));
    url.searchParams.set("chain_id", String(chainId));

    const headers = {
      "X-API-Key": getCambrianApiKey(),
      "Content-Type": "application/json",
    } as const;

    const res = await fetch(url.toString(), { method: "GET", headers });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `Cambrian price-current request failed (status: ${res.status}). Details: ${text}`
      );
    }

    const data = await res.json();
    // Pass through useful fields if available, alongside raw
    return {
      address: String(context.address),
      chain_id: chainId,
      price_usd: data?.price_usd ?? data?.usd ?? undefined,
      price_native: data?.price_native ?? undefined,
      symbol: data?.symbol ?? undefined,
      name: data?.name ?? undefined,
      raw: data,
    };
  },
});


