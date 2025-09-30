import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

const forecastSchema = z.object({
  date: z.string(),
  maxTemp: z.number(),
  minTemp: z.number(),
  precipitationChance: z.number(),
  condition: z.string(),
  location: z.string(),
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

const fetchWeather = createStep({
  id: "fetch-weather",
  description: "Fetches weather forecast for a given city",
  inputSchema: z.object({
    city: z.string().describe("The city to get the weather for"),
  }),
  outputSchema: forecastSchema,
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }

    try {
      const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(inputData.city)}&count=1`;
      const geocodingResponse = await fetch(geocodingUrl);

      if (!geocodingResponse.ok) {
        throw new Error(
          `Geocoding API error: ${geocodingResponse.status} ${geocodingResponse.statusText}`
        );
      }

      const geocodingData = (await geocodingResponse.json()) as {
        results: { latitude: number; longitude: number; name: string }[];
      };

      if (!geocodingData.results?.[0]) {
        throw new Error(`Location '${inputData.city}' not found`);
      }

      const { latitude, longitude, name } = geocodingData.results[0];

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=precipitation,weathercode&timezone=auto&hourly=precipitation_probability,temperature_2m`;
      const response = await fetch(weatherUrl);

      if (!response.ok) {
        throw new Error(
          `Weather API error: ${response.status} ${response.statusText}`
        );
      }

      const data = (await response.json()) as {
        current: {
          time: string;
          precipitation: number;
          weathercode: number;
        };
        hourly: {
          precipitation_probability: number[];
          temperature_2m: number[];
        };
      };

      const forecast = {
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

      return forecast;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch weather data: ${error.message}`);
      }
      throw error;
    }
  },
});

const planActivities = createStep({
  id: "plan-activities",
  description: "Suggests activities based on weather conditions",
  inputSchema: forecastSchema,
  outputSchema: z.object({
    activities: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    const forecast = inputData;

    if (!forecast) {
      throw new Error("Forecast data not found");
    }

    const agent = mastra?.getAgent("weatherAgent");
    if (!agent) {
      throw new Error("Weather agent not found");
    }

    const prompt = `Create an activity plan for ${forecast.location} based on this weather:
Temperature: ${forecast.minTemp}°C to ${forecast.maxTemp}°C
Conditions: ${forecast.condition}
Precipitation chance: ${forecast.precipitationChance}%

Format your response EXACTLY like this (use emojis):

📅 [Today's Date]
═══════════════════════════

🌡️ RESUMO DO TEMPO
• Condições: ${forecast.condition}
• Temperatura: ${forecast.minTemp}°C a ${forecast.maxTemp}°C
• Chance de precipitação: ${forecast.precipitationChance}%

🌅 ATIVIDADES DA MANHÃ
Ao ar livre:
• [Activity] - [Description]
  Melhor horário: [time]
  Nota: [weather tip]

🌞 ATIVIDADES DA TARDE
Ao ar livre:
• [Activity] - [Description]
  Melhor horário: [time]
  Nota: [weather tip]

🏠 ALTERNATIVAS INDOOR
• [Activity] - [Description]
  Ideal para: [condition]

⚠️ CONSIDERAÇÕES ESPECIAIS
• [Weather warnings or tips]

Keep it brief but helpful. Use specific local venues/locations for ${forecast.location}.`;

    // Use generate instead of stream for workflow to avoid loops
    const response = await agent.generate([
      {
        role: "user",
        content: prompt,
      },
    ]);

    return {
      activities: response.text,
    };
  },
});

const weatherWorkflow = createWorkflow({
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

weatherWorkflow.commit();

export { weatherWorkflow };
