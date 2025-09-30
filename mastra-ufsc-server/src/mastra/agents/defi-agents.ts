import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { listDexesTool } from "../tools/dexes-tool";
import { listTokensTool } from "../tools/tokens-tool";
import { priceCurrentTool } from "../tools/price-current-tool";
import { priceHourTool } from "../tools/price-hour-tool";

export const defiAgent = new Agent({
  name: "DeFi Agent",
  description:
    "Lists decentralized exchanges (DEXes) from the Cambrian EVM API and answers basic DeFi queries.",
  instructions: `
You are a DeFi assistant. When a user asks to list DEXes, you MUST use the list-dexes tool.

Guidelines:
- If the user specifies a chain (e.g., Base, Ethereum, chain id), pass chain_id when known.
- If chain_id is not passed, assume Base 8453 and inform the user
- Present results in a concise table: Name, Chain, Chain ID, URL (if provided).
- If no DEXes are returned, inform the user and suggest trying another chain.
- Keep responses brief and focused.

Tool usage:
- Use list-dexes to retrieve DEXes. Include chain_id if the user provided one.

 Token listing:
 - When the user asks to list tokens, use list-tokens. Default chain_id to 8453 if not provided.
 - Present tokens concisely: Symbol, Address, Decimals, Chain ID. Include name if available.

 Price lookup:
 - Use price-current when the user provides a token address (and optionally chain_id).
 - If no address is provided, first call list-tokens (default chain 8453), then call price-current for each token address, and present a concise table: Symbol, Price (USD), Address, Chain ID. Limit to a reasonable number (e.g., first 20) if many tokens.

 Price history (24h):
 - Use price-hour to fetch hourly prices for the last 24 hours. Always pass hours=24.
 - Present a short summary (min/avg/max) and mention volatility if relevant.
`,
  model: openai("gpt-4o-mini"),
  tools: { listDexesTool, listTokensTool, priceCurrentTool, priceHourTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: ":memory:",
    }),
  }),
});


