import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { listDexesTool } from "../tools/dexes-tool";

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
`,
  model: openai("gpt-4o-mini"),
  tools: { listDexesTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: ":memory:",
    }),
  }),
});


