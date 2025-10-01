import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";

// Import from domain modules
import { beachAgent } from "./domains/beach";
import { defiAgent } from "./domains/defi";
import { inventoryAgent } from "./domains/inventory";
import { movieAgent } from "./domains/movie";
import { studyAgent } from "./domains/study";
import { weatherAgent, weatherWorkflow } from "./domains/weather";

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: {
    weatherAgent,
    inventoryAgent,
    defiAgent,
    movieAgent,
    beachAgent,
    studyAgent,
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
