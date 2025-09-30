import "dotenv/config";

/**
 * Get Cambrian API key from environment
 */
export function getApiKey(): string {
  const key = process.env.CAMBRIAN_API_KEY;
  if (!key) {
    console.error(
      "❌ Missing CAMBRIAN_API_KEY in environment.\n" +
        "   Create a .env file with: CAMBRIAN_API_KEY=your-key-here"
    );
    process.exit(1);
  }
  return key;
}

/**
 * Get optional base URL override from environment
 */
export function getBaseUrl(): string | undefined {
  return process.env.CAMBRIAN_BASE_URL;
}
