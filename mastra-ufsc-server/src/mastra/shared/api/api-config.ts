import {
  getCacheTtl,
  getOmdbApiKey,
  getRateLimitConfig,
  getTmdbApiKey,
} from "../config/env";

// API configuration for external movie data sources
export interface ApiConfig {
  baseUrl: string;
  headers?: Record<string, string>;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

// TMDB API configuration (more reliable than OMDB for our use case)
export const TMDB_CONFIG: ApiConfig = {
  baseUrl: "https://api.themoviedb.org/3",
  timeout: 10000, // 10 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

// JustWatch unofficial API configuration
export const JUSTWATCH_CONFIG: ApiConfig = {
  baseUrl: "https://apis.justwatch.com/content",
  timeout: 10000,
  retryAttempts: 2,
  retryDelay: 2000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    Accept: "application/json",
    "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
  },
};

// API keys from environment with validation
// Note: These getters will throw clear errors if required keys are missing
export const API_KEYS = {
  get TMDB(): string {
    return getTmdbApiKey();
  },
  get OMDB(): string {
    return getOmdbApiKey() || ""; // Optional backup
  },
};

// Cache configuration
export const CACHE_CONFIG = {
  ttl: getCacheTtl(),
  maxSize: 1000, // Maximum number of cached items
};

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = getRateLimitConfig();

// Brazilian locale configuration
export const BR_LOCALE = {
  language: "pt-BR",
  region: "BR",
  country: "BR",
  timezone: "America/Sao_Paulo",
};
