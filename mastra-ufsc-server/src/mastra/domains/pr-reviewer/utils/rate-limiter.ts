export class RateLimiter {
  private limits: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async checkLimit(key: string): Promise<boolean> {
    const now = Date.now();
    const timestamps = this.limits.get(key) || [];

    const validTimestamps = timestamps.filter((t) => now - t < this.windowMs);

    if (validTimestamps.length >= this.maxRequests) {
      return false;
    }

    validTimestamps.push(now);
    this.limits.set(key, validTimestamps);

    return true;
  }

  async waitForSlot(key: string): Promise<void> {
    while (!(await this.checkLimit(key))) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  getRemainingRequests(key: string): number {
    const now = Date.now();
    const timestamps = this.limits.get(key) || [];
    const validTimestamps = timestamps.filter((t) => now - t < this.windowMs);

    return Math.max(0, this.maxRequests - validTimestamps.length);
  }

  getResetTime(key: string): number {
    const timestamps = this.limits.get(key) || [];
    if (timestamps.length === 0) return 0;

    const oldestTimestamp = Math.min(...timestamps);
    return oldestTimestamp + this.windowMs;
  }

  reset(key?: string): void {
    if (key) {
      this.limits.delete(key);
    } else {
      this.limits.clear();
    }
  }
}

export const rateLimiter = new RateLimiter(
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "10"),
  parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000")
);