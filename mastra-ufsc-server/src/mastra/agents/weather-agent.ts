import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";

import { forecastTool } from "../tools/forecast-tool";
import { weatherTool } from "../tools/weather-tool";
import { weatherWorkflow } from "../workflows/weather-workflow";

import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";


export async function createWeatherAgent() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const prompt = await readFile(join(__dirname, "./weather-agent.prompt"), "utf-8");
  return new Agent({
    name: "Weather Agent",
    instructions: prompt,
    model: openai("gpt-4o-mini"),
    tools: { weatherTool, forecastTool },
    workflows: { weatherWorkflow },
    memory: new Memory({
      storage: new LibSQLStore({
        url: "file:../mastra.db", // path is relative to the .mastra/output directory
      }),
    }),
  });
}
