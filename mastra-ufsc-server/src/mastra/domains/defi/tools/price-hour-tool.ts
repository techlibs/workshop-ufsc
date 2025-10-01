import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getCambrianApiKey, getCambrianBaseUrl } from "../../../shared/config/env";

export const priceHourTool = createTool({
  id: "price-hour",
  description:
    "Get hourly token prices from Cambrian API for the past N hours (default 24) for a given token address and chain_id (default 8453).",
  inputSchema: z.object({
    address: z
      .string()
      .describe("Token contract address (checksummed) for EVM chain"),
    chain_id: z
      .number()
      .int()
      .optional()
      .describe("EVM chain id. Defaults to 8453 (Base)."),
    hours: z
      .number()
      .int()
      .optional()
      .describe("Number of hours to fetch. Defaults to 24."),
  }),
  outputSchema: z.object({
    address: z.string(),
    chain_id: z.number(),
    hours: z.number(),
    series: z.any(),
    raw: z.any().optional(),
  }),
  execute: async ({ context }) => {
    const baseUrl = getCambrianBaseUrl() ?? "https://opabinia.cambrian.network";
    const url = new URL("/api/v1/evm/price-hour", baseUrl);
    const chainId = context?.chain_id ?? 8453;
    const hours = context?.hours ?? 24;
    url.searchParams.set("token_address", String(context.address));
    url.searchParams.set("chain_id", String(chainId));
    url.searchParams.set("hours", String(hours));

    const headers = {
      "X-API-Key": getCambrianApiKey(),
      "Content-Type": "application/json",
    } as const;

    const res = await fetch(url.toString(), { method: "GET", headers });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `Cambrian price-hour request failed (status: ${res.status}). Details: ${text}`
      );
    }

    const data = await res.json();
    return {
      address: String(context.address),
      chain_id: chainId,
      hours,
      series: data,
      raw: data,
    };
  },
});


