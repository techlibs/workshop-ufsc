/**
 * Maps common city nicknames to official names for geocoding API
 */
const cityNicknameMap: Record<string, string> = {
  // Brazil
  floripa: "Florianópolis",
  sampa: "São Paulo",
  rio: "Rio de Janeiro",
  poa: "Porto Alegre",
  bh: "Belo Horizonte",

  // Add more as needed
  nyc: "New York",
  la: "Los Angeles",
  sf: "San Francisco",
  dc: "Washington",
};

/**
 * Normalizes a city name by checking for known nicknames
 * @param city - The city name or nickname
 * @returns The official city name
 */
export function normalizeCityName(city: string): string {
  const normalized = city.toLowerCase().trim();
  return cityNicknameMap[normalized] || city;
}
