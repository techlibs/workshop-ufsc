import type {
  ApiResponse,
  CambrianClientConfig,
  RequestOptions,
  TabularBlock,
} from "./types.js";

const DEFAULT_BASE_URL = "https://opabinia.cambrian.network";

/**
 * Core Cambrian API Client
 * Handles authentication, request building, and response parsing
 */
export class CambrianClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: CambrianClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
  }

  /**
   * Build a full URL with query parameters
   */
  private buildUrl(
    path: string,
    params?: Record<string, string | number | boolean | undefined>
  ): string {
    const url = new URL(path, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          url.searchParams.set(k, String(v));
        }
      });
    }
    return url.toString();
  }

  /**
   * Make authenticated GET request
   */
  private async get<T = any>(path: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-Key": this.apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Request failed ${res.status} ${res.statusText}: ${text}`);
    }

    return res.json();
  }

  /**
   * Convert tabular response to array of objects
   */
  public tabularToObjects(payload: ApiResponse): Record<string, any>[] {
    const blocks: TabularBlock[] = Array.isArray(payload) ? payload : [payload];
    const results: Record<string, any>[] = [];

    for (const block of blocks) {
      if (!block || !Array.isArray(block.columns) || !Array.isArray(block.data)) {
        continue;
      }

      const names = block.columns.map((c: { name: string }) => c.name);
      for (const row of block.data) {
        const obj: Record<string, any> = {};
        names.forEach((n: string, idx: number) => {
          obj[n] = row[idx];
        });
        results.push(obj);
      }
    }

    return results;
  }

  /**
   * Get raw API response
   */
  public async getRaw(path: string, options?: RequestOptions): Promise<ApiResponse> {
    return this.get(path, options);
  }

  /**
   * Get API response as array of objects
   */
  public async getObjects(
    path: string,
    options?: RequestOptions
  ): Promise<Record<string, any>[]> {
    const data = await this.get(path, options);
    return this.tabularToObjects(data);
  }

  // ==================== Solana Endpoints ====================

  /**
   * Get latest Solana block number and time
   */
  async getLatestBlock() {
    return this.getObjects("/api/v1/solana/latest-block");
  }

  /**
   * Get current USD price for a Solana token
   */
  async getCurrentPrice(address: string) {
    return this.getObjects("/api/v1/solana/price-current", {
      params: { token_address: address },
    });
  }

  /**
   * Get token details for a Solana token
   */
  async getTokenDetails(address: string) {
    return this.getObjects("/api/v1/solana/token-details", {
      params: { address },
    });
  }

  // ==================== EVM Endpoints ====================

  /**
   * Get list of supported EVM chains
   */
  async getEvmChains() {
    return this.getObjects("/api/v1/evm/chains");
  }

  /**
   * Get list of EVM DEXes
   */
  async getEvmDexes(chain_id?: number) {
    return this.getObjects("/api/v1/evm/dexes", { params: { chain_id } });
  }

  /**
   * Get list of all Uniswap V3 pools
   * @param chain_id - Chain ID (e.g., 8453 for Base, 1 for Ethereum)
   * @param limit - Number of results to return
   * @param offset - Pagination offset
   */
  async getUniswapV3Pools(params?: {
    chain_id?: number;
    token_address?: string;
    order_asc?: string;
    order_desc?: string;
  }) {
    return this.getObjects("/api/v1/evm/uniswap/v3/pools", {
      params,
    });
  }

  /**
   * Get detailed info for a specific Uniswap V3 pool
   * @param address - Pool contract address
   * @param chain_id - Chain ID (e.g., 8453 for Base, 1 for Ethereum)
   */
  async getUniswapV3Pool(address: string, chain_id?: number) {
    return this.getObjects("/api/v1/evm/uniswap/v3/pool", {
      params: { address, chain_id },
    });
  }

  /**
   * Get current price for an EVM token
   */
  async getEvmPrice(token_address: string, chain_id: number) {
    return this.getObjects("/api/v1/evm/price-current", {
      params: { token_address, chain_id },
    });
  }

  /**
   * Get historical hourly price for an EVM token
   */
  async getEvmPriceHour(
    token_address: string,
    chain_id: number,
    hours: number
  ) {
    return this.getObjects("/api/v1/evm/price-hour", {
      params: {
        token_address,
        chain_id,
        hours
      },
    });
  }

  /**
   * Get list of whitelisted tokens for an EVM chain
   */
  async getEvmTokens(chain_id: number) {
    return this.getObjects("/api/v1/evm/tokens", {
      params: { chain_id },
    });
  }
}

/**
 * Factory function to create a client instance
 */
export function createClient(apiKey: string, baseUrl?: string): CambrianClient {
  return new CambrianClient({ apiKey, baseUrl });
}
