/**
 * Shared types for Cambrian API client
 */

export type Column = {
  name: string;
  type: string;
};

export type TabularBlock = {
  columns: Column[];
  data: any[][];
  rows: number;
};

export type ApiResponse = TabularBlock | TabularBlock[];

export interface CambrianClientConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>;
}
