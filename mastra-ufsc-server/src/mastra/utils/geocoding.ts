import { normalizeCityName } from "./city-mapper";

interface GeocodingResponse {
  results: {
    latitude: number;
    longitude: number;
    name: string;
  }[];
}

interface GeocodingResult {
  latitude: number;
  longitude: number;
  name: string;
}

/**
 * Shared geocoding utility to avoid code duplication
 * Converts a city name to geographic coordinates
 * @param location - City name (supports nicknames)
 * @returns Geographic coordinates and official city name
 * @throws Error if location is not found
 */
export async function geocodeLocation(
  location: string
): Promise<GeocodingResult> {
  // Normalize city name to handle nicknames
  const normalizedLocation = normalizeCityName(location);

  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(normalizedLocation)}&count=1`;
  
  const geocodingResponse = await fetch(geocodingUrl);
  const geocodingData = (await geocodingResponse.json()) as GeocodingResponse;

  if (!geocodingData.results?.[0]) {
    // Provide helpful error message
    const suggestion =
      normalizedLocation !== location
        ? ` (normalized from "${location}" to "${normalizedLocation}")`
        : "";
    throw new Error(
      `Location '${location}' not found${suggestion}. Please use the full city name.`
    );
  }

  return geocodingData.results[0];
}
