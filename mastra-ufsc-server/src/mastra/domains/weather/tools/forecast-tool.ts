import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { geocodeLocation } from "../utils/geocoding";

interface ForecastResponse {
  current: {
    time: string;
    precipitation: number;
    weathercode: number;
  };
  hourly: {
    precipitation_probability: number[];
    temperature_2m: number[];
  };
}

export const forecastTool = createTool({
  id: "get-forecast",
  description:
    "Get weather forecast with min/max temperatures and precipitation chance. Supports city nicknames (e.g., 'floripa' for Florianópolis).",
  inputSchema: z.object({
    location: z.string().describe("City name or common nickname"),
  }),
  outputSchema: z.object({
    date: z.string(),
    maxTemp: z.number(),
    minTemp: z.number(),
    precipitationChance: z.number(),
    condition: z.string(),
    location: z.string(),
  }),
  execute: async ({ context }) => {
    // Use shared geocoding utility with nickname support
    const { latitude, longitude, name } = await geocodeLocation(
      context.location
    );

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=precipitation,weathercode&timezone=auto&hourly=precipitation_probability,temperature_2m`;
    const response = await fetch(weatherUrl);
    const data = (await response.json()) as ForecastResponse;

    return {
      date: new Date().toISOString(),
      maxTemp: Math.max(...data.hourly.temperature_2m),
      minTemp: Math.min(...data.hourly.temperature_2m),
      condition: getWeatherCondition(data.current.weathercode),
      precipitationChance: data.hourly.precipitation_probability.reduce(
        (acc, curr) => Math.max(acc, curr),
        0
      ),
      location: name,
    };
  },
});

function getWeatherCondition(code: number): string {
  const conditions: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    95: "Thunderstorm",
  };
  return conditions[code] || "Unknown";
}
