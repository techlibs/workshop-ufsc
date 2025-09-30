import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { forecastTool } from "../tools/forecast-tool";

// Schema for weather forecast data
const forecastSchema = z.object({
  date: z.string(),
  maxTemp: z.number(),
  minTemp: z.number(),
  precipitationChance: z.number(),
  condition: z.string(),
  location: z.string(),
});

// Step 1: Fetch weather data using the forecast tool
const fetchWeather = createStep({
  id: "fetch-weather",
  description: "Fetches weather forecast for a given city",
  inputSchema: z.object({
    city: z.string().describe("The city to get the weather for"),
  }),
  outputSchema: forecastSchema,
  execute: async ({ inputData, mastra }) => {
    const logger = mastra?.getLogger();

    if (!inputData) {
      throw new Error("Input data not found");
    }

    logger?.info("Fetching weather", { city: inputData.city });

    try {
      const forecast = await forecastTool.execute({
        context: { location: inputData.city },
        mastra,
      } as any);

      logger?.info("Weather fetched", { location: forecast.location });
      return forecast;
    } catch (error) {
      logger?.error("Weather fetch failed", {
        error: error instanceof Error ? error.message : "Unknown error",
        city: inputData.city,
      });
      throw error;
    }
  },
});

// Activity suggestion prompt template
const createActivityPrompt = (forecast: z.infer<typeof forecastSchema>) => `
Create a brief activity plan for ${forecast.location} based on this weather:
- Temperature: ${forecast.minTemp}°C to ${forecast.maxTemp}°C
- Conditions: ${forecast.condition}
- Rain chance: ${forecast.precipitationChance}%

Suggest 2-3 activities for morning and afternoon, plus an indoor alternative.
Keep it concise and practical.
`;

// Step 2: Generate activity suggestions based on weather
const planActivities = createStep({
  id: "plan-activities",
  description: "Suggests activities based on weather conditions",
  inputSchema: forecastSchema,
  outputSchema: z.object({
    activities: z.string(),
  }),
  execute: async ({ inputData: forecast, mastra }) => {
    const logger = mastra?.getLogger();

    if (!forecast) {
      throw new Error("Forecast data not found");
    }

    const agent = mastra?.getAgent("weatherAgent");
    if (!agent) {
      throw new Error("Weather agent not found");
    }

    logger?.info("Planning activities", { location: forecast.location });

    try {
      // Use the agent to generate activity suggestions
      const response = await agent.generate([
        {
          role: "system",
          content:
            "IMPORTANT: You are being called from within a workflow. DO NOT use any workflows or tools. Just provide the formatted activity suggestions directly. You are an activity planner that provides concise, practical suggestions based on weather conditions.",
        },
        {
          role: "user",
          content: createActivityPrompt(forecast),
        },
      ]);

      logger?.info("Activities planned", { location: forecast.location });

      return {
        activities: response.text,
      };
    } catch (error) {
      logger?.error("Activity planning failed", {
        error: error instanceof Error ? error.message : "Unknown error",
        location: forecast.location,
      });
      throw error;
    }
  },
});

// Create the weather workflow by chaining steps
export const weatherWorkflow = createWorkflow({
  id: "weather-workflow",
  inputSchema: z.object({
    city: z.string().describe("The city to get the weather for"),
  }),
  outputSchema: z.object({
    activities: z.string(),
  }),
})
  .then(fetchWeather)
  .then(planActivities);

// Commit the workflow to make it available
weatherWorkflow.commit();
