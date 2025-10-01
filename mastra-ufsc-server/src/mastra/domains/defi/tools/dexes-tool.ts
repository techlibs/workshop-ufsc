import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import {
  getCambrianApiKey,
  getCambrianBaseUrl,
} from "../../../shared/config/env";

export const listDexesTool = createTool({
  id: "list-dexes",
  description:
    "List DEXes from Cambrian EVM API. Optionally filter by chain_id.",
  inputSchema: z.object({
    chain_id: z
      .number()
      .int()
      .optional()
      .describe("Optional EVM chain id to filter DEXes"),
    limit: z.number().int().optional().describe("Optional page size limit"),
    offset: z.number().int().optional().describe("Optional pagination offset"),
  }),
  outputSchema: z.object({
    dexes: z.array(z.any()),
    count: z.number(),
  }),
  execute: async ({ context }) => {
    // The Cambrian client exposes getObjects method internally, not exported. So we perform a direct fetch.
    const baseUrl = getCambrianBaseUrl() ?? "https://opabinia.cambrian.network";
    const url = new URL("/api/v1/evm/dexes", baseUrl);
    if (context?.chain_id)
      url.searchParams.set("chain_id", String(context.chain_id));

    const headers = {
      "X-API-Key": getCambrianApiKey(),
      "Content-Type": "application/json",
    } as const;

    // First attempt (honor filters if provided)
    let res = await fetch(url.toString(), { method: "GET", headers });

    // If bad request or unprocessable (likely unsupported filter), retry without filters
    if (!res.ok && [400, 404, 422].includes(res.status) && context?.chain_id) {
      const fallbackUrl = new URL("/api/v1/evm/dexes", baseUrl);
      res = await fetch(fallbackUrl.toString(), { method: "GET", headers });
    }

    if (!res.ok) {
      const text = await res.text();
      // Surface structured error for the agent
      throw new Error(
        `Cambrian DEXes request failed (status: ${res.status}). Details: ${text}`
      );
    }

    const dexes = await res.json();
    return { dexes, count: Array.isArray(dexes) ? dexes.length : 0 };
  },
});
