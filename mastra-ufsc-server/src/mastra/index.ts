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
import {
  metaAgentRequirementsCollectorWorkflow,
  requirementsJudgeAgent,
  contextRetrieverAgent,
  interviewerAgent,
} from "./domains/meta-agent/requirements-collector";
import { agentCreatorAgent } from "./domains/agent-creator";
import { WeatherForecastFortalezaAgent } from "./domains/weather-forecast-fortaleza/agent";

export const mastra = new Mastra({
  workflows: { weatherWorkflow, metaAgentRequirementsCollectorWorkflow },
  agents: {
    weatherAgent,
    inventoryAgent,
    defiAgent,
    movieAgent,
    beachAgent,
    studyAgent,
    // Meta-agent system components (may not all be directly user-facing)
    requirementsJudgeAgent,
    contextRetrieverAgent,
    interviewerAgent,
    agentCreatorAgent,
    weatherForecastFortalezaAgent: WeatherForecastFortalezaAgent,
  },
  storage: new LibSQLStore({
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});