import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";

// Import from domain modules
import { beachAgent } from "./domains/beach";
import { defiAgent } from "./domains/defi";
import { inventoryAgent } from "./domains/inventory";
// import { movieAgent } from "./domains/movie"; // Disabled: requires TMDB_API_KEY
import { studyAgent } from "./domains/study";
import { weatherAgent, weatherWorkflow } from "./domains/weather";
import { githubTelegramAgent, prTelegramWorkflow } from "./domains/github-telegram";
import { dietTelegramAgent, dailyDietTipWorkflow } from "./domains/diet-telegram";
import { metaAgent, metaAgentWorkflow } from "./domains/meta-agent";

export const mastra = new Mastra({
  workflows: { weatherWorkflow, prTelegramWorkflow, dailyDietTipWorkflow, metaAgentWorkflow },
  agents: {
    weatherAgent,
    inventoryAgent,
    defiAgent,
    // movieAgent, // Disabled: requires TMDB_API_KEY
    beachAgent,
    studyAgent,
    githubTelegramAgent,
    dietTelegramAgent,
    metaAgent,
  },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});
