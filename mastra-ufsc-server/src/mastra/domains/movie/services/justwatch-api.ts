import { ApiCache } from "../../../shared/api/api-cache";
import { JUSTWATCH_CONFIG } from "../../../shared/api/api-config";
import { BaseApiClient } from "../../../shared/api/base-api-client";
import { Provider } from "../utils/movie-data";

// JustWatch provider mapping
// Note: Prime Video is mapped to Stremio since it's not in our Provider type
const PROVIDER_MAPPING: Record<number, Provider["name"]> = {
  8: "Netflix",
  2: "Apple TV",
  119: "Stremio", // Amazon Prime Video mapped to Stremio for now
  384: "HBO Max",
  43: "Stremio", // Using as a generic free option
  // Add more provider IDs as needed
};

interface JustWatchProvider {
  provider_id: number;
  display_priority: number;
  logo_path: string;
  provider_name: string;
  monetization_type: string;
}

interface JustWatchOffer {
  monetization_type: string;
  provider_id: number;
  retail_price?: number;
  currency?: string;
  urls?: {
    standard_web: string;
  };
  presentation_type: string;
}

interface JustWatchSearchResult {
  id: number;
  title: string;
  original_title: string;
  release_year?: number;
  object_type: "movie" | "show";
  offers?: JustWatchOffer[];
  scoring?: Array<{
    provider_type: string;
    value: number;
  }>;
  poster?: string;
}

interface JustWatchTitle {
  id: number;
  title: string;
  original_title: string;
  genre_names: string[];
  short_description: string;
  offers: JustWatchOffer[];
  scoring: Array<{
    provider_type: string;
    value: number;
  }>;
  runtime?: number;
  seasons?: number;
  poster?: string;
}

export class JustWatchApiClient {
  private client: BaseApiClient;
  private cache: ApiCache;
  private locale: string = "pt_BR";

  constructor() {
    this.client = new BaseApiClient(JUSTWATCH_CONFIG);
    this.cache = new ApiCache();
  }

  async searchContent(
    query: string,
    contentTypes: string[] = ["movie", "show"]
  ): Promise<JustWatchSearchResult[]> {
    const cacheKey = ApiCache.generateKey("jw-search", { query, contentTypes });
    const cached = this.cache.get<JustWatchSearchResult[]>(cacheKey);

    if (cached) return cached;

    try {
      const body = {
        query,
        content_types: contentTypes,
        page: 1,
        page_size: 20,
        fields: [
          "id",
          "title",
          "original_title",
          "release_year",
          "object_type",
          "offers",
          "scoring",
          "poster",
        ],
      };

      const response = await this.client.fetch<{
        items: JustWatchSearchResult[];
      }>(`/titles/${this.locale}/popular`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      this.cache.set(cacheKey, response.items || [], 3600);
      return response.items || [];
    } catch (error) {
      console.error("JustWatch search error:", error);
      return [];
    }
  }

  async getTitle(
    contentType: "movie" | "show",
    justWatchId: number
  ): Promise<JustWatchTitle | null> {
    const cacheKey = ApiCache.generateKey("jw-title", {
      contentType,
      justWatchId,
    });
    const cached = this.cache.get<JustWatchTitle>(cacheKey);

    if (cached) return cached;

    try {
      const endpoint = contentType === "movie" ? "movie" : "show";
      const response = await this.client.fetch<JustWatchTitle>(
        `/titles/${endpoint}/${justWatchId}/locale/${this.locale}`
      );

      this.cache.set(cacheKey, response, 3600);
      return response;
    } catch (error) {
      console.error("JustWatch title fetch error:", error);
      return null;
    }
  }

  async getProvidersByTitle(title: string, year?: number): Promise<Provider[]> {
    try {
      const results = await this.searchContent(title);

      // Find best match
      const match = results.find((item) => {
        const titleMatch =
          item.title.toLowerCase() === title.toLowerCase() ||
          item.original_title?.toLowerCase() === title.toLowerCase();
        const yearMatch = !year || item.release_year === year;
        return titleMatch && yearMatch;
      });

      if (!match || !match.offers) {
        return [];
      }

      return this.convertOffersToProviders(match.offers);
    } catch (error) {
      console.error("Error getting providers:", error);
      return [];
    }
  }

  private convertOffersToProviders(offers: JustWatchOffer[]): Provider[] {
    const providers: Provider[] = [];
    const seen = new Set<string>();

    offers.forEach((offer) => {
      const providerName = PROVIDER_MAPPING[offer.provider_id];
      if (!providerName) return;

      let type: Provider["type"];
      switch (offer.monetization_type) {
        case "flatrate":
        case "free":
        case "ads":
          type = "stream";
          break;
        case "rent":
          type = "rent";
          break;
        case "buy":
          type = "buy";
          break;
        default:
          return;
      }

      const quality = this.getQualityFromPresentation(offer.presentation_type);
      const key = `${providerName}-${type}-${quality}`;

      if (!seen.has(key)) {
        seen.add(key);
        providers.push({
          name: providerName,
          type,
          quality,
          price: offer.retail_price,
        });
      }
    });

    return providers;
  }

  private getQualityFromPresentation(presentation: string): "SD" | "HD" | "4K" {
    if (presentation.includes("4k") || presentation.includes("uhd")) {
      return "4K";
    }
    if (
      presentation.includes("hd") ||
      presentation.includes("720") ||
      presentation.includes("1080")
    ) {
      return "HD";
    }
    return "SD";
  }

  async getPopularContent(
    contentType: "movie" | "show" = "movie",
    providers?: number[]
  ): Promise<JustWatchSearchResult[]> {
    const cacheKey = ApiCache.generateKey("jw-popular", {
      contentType,
      providers,
    });
    const cached = this.cache.get<JustWatchSearchResult[]>(cacheKey);

    if (cached) return cached;

    try {
      const body = {
        content_types: [contentType],
        page: 1,
        page_size: 30,
        providers: providers,
        fields: [
          "id",
          "title",
          "original_title",
          "release_year",
          "object_type",
          "offers",
          "scoring",
          "poster",
        ],
      };

      const response = await this.client.fetch<{
        items: JustWatchSearchResult[];
      }>(`/titles/${this.locale}/popular`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      this.cache.set(cacheKey, response.items || [], 1800); // 30 minutes
      return response.items || [];
    } catch (error) {
      console.error("JustWatch popular content error:", error);
      return [];
    }
  }

  // Get provider IDs for filtering
  getProviderIds(providerNames: Provider["name"][]): number[] {
    const ids: number[] = [];
    Object.entries(PROVIDER_MAPPING).forEach(([id, name]) => {
      if (providerNames.includes(name)) {
        ids.push(parseInt(id));
      }
    });
    return ids;
  }
}
