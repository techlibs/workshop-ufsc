import type { CacheEntry } from "../types/pr-types";

export class CacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number;

  constructor(defaultTTL: number = 300000) {
    this.defaultTTL = defaultTTL;
    this.startCleanupInterval();
  }

  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      return undefined;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.data;
  }

  set<T>(key: string, value: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };

    this.cache.set(key, entry);
  }

  invalidate(pattern: string): void {
    const keys = Array.from(this.cache.keys());
    keys
      .filter((k) => k.includes(pattern))
      .forEach((k) => this.cache.delete(k));
  }

  invalidateAll(): void {
    this.cache.clear();
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if (now - entry.timestamp > entry.ttl) {
          this.cache.delete(key);
        }
      }
    }, 60000);
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export const cache = new CacheService(300000);