import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getCambrianApiKey, getCambrianBaseUrl } from "../utils/env";

export const listTokensTool = createTool({
  id: "list-tokens",
  description:
    "List whitelisted EVM tokens from Cambrian API. Defaults to Base 8453.",
  inputSchema: z.object({
    chain_id: z
      .number()
      .int()
      .optional()
      .describe("EVM chain id to filter tokens. Defaults to 8453 (Base)."),
    limit: z
      .number()
      .int()
      .optional()
      .describe("Optional page size limit"),
    offset: z
      .number()
      .int()
      .optional()
      .describe("Optional pagination offset"),
  }),
  outputSchema: z.object({
    tokens: z.array(z.any()),
    count: z.number(),
  }),
  execute: async ({ context }) => {
    const baseUrl = getCambrianBaseUrl() ?? "https://opabinia.cambrian.network";
    const url = new URL("/api/v1/evm/tokens", baseUrl);
    const chainId = context?.chain_id ?? 8453;
    url.searchParams.set("chain_id", String(chainId));
  
    const headers = {
      "X-API-Key": getCambrianApiKey(),
      "Content-Type": "application/json",
    } as const;

    let res = await fetch(url.toString(), { method: "GET", headers });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `Cambrian tokens request failed (status: ${res.status}). Details: ${text}`
      );
    }

    const tokens = await res.json();
    return { tokens, count: Array.isArray(tokens) ? tokens.length : 0 };
  },
});


