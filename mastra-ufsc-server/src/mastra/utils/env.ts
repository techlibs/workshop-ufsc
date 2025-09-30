import "dotenv/config";

export function getCambrianApiKey(): string {
  const key = process.env.CAMBRIAN_API_KEY;
  if (!key) {
    throw new Error(
      "Missing CAMBRIAN_API_KEY in environment. Create .env with CAMBRIAN_API_KEY=..."
    );
  }
  return key;
}

export function getCambrianBaseUrl(): string | undefined {
  return process.env.CAMBRIAN_BASE_URL;
}


