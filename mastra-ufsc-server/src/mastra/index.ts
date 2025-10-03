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
import { agentCreatorAgent } from "./domains/agent-creator";
import { MotivationalMessageSenderAgent } from "./domains/motivational-message-sender";
import { TestTelegramAgentAgent } from "./domains/test-telegram-agent";

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: {
    weatherAgent,
    inventoryAgent,
    defiAgent,
    movieAgent,
    beachAgent,
    studyAgent,
    agentCreatorAgent,
    MotivationalMessageSenderAgent,
    TestTelegramAgentAgent,
  },
  storage: new LibSQLStore({
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});
