import "dotenv/config";

/**
 * Environment variable validation utilities
 * Provides clear error messages when required environment variables are missing
 */

export function getCambrianApiKey(): string {
  const key = process.env.CAMBRIAN_API_KEY;
  if (!key) {
    throw new Error(
      "❌ Missing CAMBRIAN_API_KEY in environment.\n" +
        "   → Create a .env file with: CAMBRIAN_API_KEY=your_key_here\n" +
        "   → Get your API key from: https://cambrian.ai"
    );
  }
  return key;
}

export function getCambrianBaseUrl(): string | undefined {
  return process.env.CAMBRIAN_BASE_URL;
}

export function getTmdbApiKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error(
      "❌ Missing TMDB_API_KEY in environment.\n" +
        "   → Create a .env file with: TMDB_API_KEY=your_key_here\n" +
        "   → Get your API key from: https://www.themoviedb.org/settings/api\n" +
        "   → See docs/getting-started/environment-setup.md for detailed instructions"
    );
  }
  return key;
}

export function getOmdbApiKey(): string | undefined {
  return process.env.OMDB_API_KEY;
}

export function getCacheTtl(): number {
  const ttl = process.env.CACHE_TTL;
  return ttl ? parseInt(ttl, 10) : 3600; // Default: 1 hour
}

export function getRateLimitConfig() {
  return {
    requests: process.env.RATE_LIMIT_REQUESTS
      ? parseInt(process.env.RATE_LIMIT_REQUESTS, 10)
      : 100,
    window: process.env.RATE_LIMIT_WINDOW
      ? parseInt(process.env.RATE_LIMIT_WINDOW, 10)
      : 3600,
  };
}

/**
 * Validates all required environment variables at startup
 * Call this at application initialization to fail fast
 */
export function validateEnvironment(
  options: {
    requireTmdb?: boolean;
    requireCambrian?: boolean;
  } = {}
): void {
  const errors: string[] = [];

  if (options.requireTmdb && !process.env.TMDB_API_KEY) {
    errors.push(
      "TMDB_API_KEY - Get from https://www.themoviedb.org/settings/api"
    );
  }

  if (options.requireCambrian && !process.env.CAMBRIAN_API_KEY) {
    errors.push("CAMBRIAN_API_KEY - Get from https://cambrian.ai");
  }

  if (errors.length > 0) {
    throw new Error(
      "❌ Missing required environment variables:\n\n" +
        errors.map((e) => `   • ${e}`).join("\n") +
        "\n\n💡 Create a .env file in the project root with these variables.\n" +
        "   See .env.example for a template.\n"
    );
  }
}
