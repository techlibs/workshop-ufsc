export class SecretsManager {
  private secrets: Map<string, string> = new Map();

  constructor() {
    this.loadSecrets();
  }

  private loadSecrets(): void {
    this.secrets.set("GITHUB_TOKEN", process.env.GITHUB_TOKEN || "");
    this.secrets.set("GITHUB_OWNER", process.env.GITHUB_OWNER || "");
    this.secrets.set("GITHUB_REPO", process.env.GITHUB_REPO || "");
    this.secrets.set(
      "GITHUB_WEBHOOK_SECRET",
      process.env.GITHUB_WEBHOOK_SECRET || ""
    );
    this.secrets.set(
      "TWILIO_ACCOUNT_SID",
      process.env.TWILIO_ACCOUNT_SID || ""
    );
    this.secrets.set(
      "TWILIO_AUTH_TOKEN",
      process.env.TWILIO_AUTH_TOKEN || ""
    );
    this.secrets.set(
      "TWILIO_WHATSAPP_FROM",
      process.env.TWILIO_WHATSAPP_FROM || ""
    );
    this.secrets.set(
      "TWILIO_WHATSAPP_TO",
      process.env.TWILIO_WHATSAPP_TO || ""
    );
  }

  get(key: string): string {
    const value = this.secrets.get(key);
    if (!value) {
      throw new Error(`Secret ${key} not found or empty`);
    }
    return value;
  }

  getOptional(key: string): string | undefined {
    return this.secrets.get(key) || undefined;
  }

  validate(): void {
    const required = ["GITHUB_TOKEN", "GITHUB_OWNER", "GITHUB_REPO"];
    const missing = required.filter((key) => !this.secrets.get(key));

    if (missing.length > 0) {
      throw new Error(`Missing required secrets: ${missing.join(", ")}`);
    }
  }

  hasWhatsAppCredentials(): boolean {
    return !!(
      this.secrets.get("TWILIO_ACCOUNT_SID") &&
      this.secrets.get("TWILIO_AUTH_TOKEN") &&
      this.secrets.get("TWILIO_WHATSAPP_FROM")
    );
  }
}

export const secrets = new SecretsManager();