import { createHash } from "crypto";

interface ProcessedRequest {
  result: any;
  timestamp: number;
}

export class IdempotencyManager {
  private processed: Map<string, ProcessedRequest> = new Map();
  private ttl: number;

  constructor(ttl: number = 3600000) {
    this.ttl = ttl;
    this.startCleanupInterval();
  }

  generateKey(data: any): string {
    const hash = createHash("sha256");
    hash.update(JSON.stringify(data));
    return hash.digest("hex");
  }

  async execute<T>(
    key: string,
    fn: () => Promise<T>
  ): Promise<{ result: T; fromCache: boolean }> {
    const cached = this.processed.get(key);

    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return { result: cached.result, fromCache: true };
    }

    const result = await fn();
    this.processed.set(key, { result, timestamp: Date.now() });

    return { result, fromCache: false };
  }

  has(key: string): boolean {
    const cached = this.processed.get(key);
    if (!cached) return false;

    return Date.now() - cached.timestamp < this.ttl;
  }

  invalidate(key: string): void {
    this.processed.delete(key);
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.processed.entries()) {
        if (now - value.timestamp > this.ttl) {
          this.processed.delete(key);
        }
      }
    }, 300000);
  }

  getStats() {
    return {
      processedCount: this.processed.size,
      ttl: this.ttl,
    };
  }
}

export const idempotencyManager = new IdempotencyManager(
  parseInt(process.env.IDEMPOTENCY_TTL_MS || "3600000")
);