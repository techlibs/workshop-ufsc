import { ApiCache } from "../../../shared/api/api-cache";
import {
  API_KEYS,
  BR_LOCALE,
  TMDB_CONFIG,
} from "../../../shared/api/api-config";
import { BaseApiClient } from "../../../shared/api/base-api-client";
import { Movie, Provider } from "../utils/movie-data";

// TMDB API response interfaces
interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
  popularity: number;
  poster_path?: string;
  backdrop_path?: string;
  adult: boolean;
}

interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  first_air_date: string;
  genre_ids: number[];
  vote_average: number;
  popularity: number;
  poster_path?: string;
  backdrop_path?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
}

interface TMDBGenre {
  id: number;
  name: string;
}

interface TMDBCredits {
  cast: Array<{
    name: string;
    character: string;
    order: number;
  }>;
  crew: Array<{
    name: string;
    job: string;
  }>;
}

interface TMDBProviders {
  results: {
    BR?: {
      flatrate?: Array<{
        provider_id: number;
        provider_name: string;
      }>;
      rent?: Array<{
        provider_id: number;
        provider_name: string;
      }>;
      buy?: Array<{
        provider_id: number;
        provider_name: string;
      }>;
    };
  };
}

export class TMDBApiClient {
  private client: BaseApiClient;
  private cache: ApiCache;
  private genres: Map<number, string> = new Map();
  private genresLoaded = false;
  private genresLoading: Promise<void> | null = null;

  constructor() {
    this.client = new BaseApiClient(TMDB_CONFIG);
    this.cache = new ApiCache();
  }

  /**
   * Lazily load genres on first need. Ensures only one in-flight fetch and
   * falls back gracefully if the remote API fails (e.g., missing API key).
   */
  private async ensureGenresLoaded(): Promise<void> {
    if (this.genresLoaded) return;
    if (this.genresLoading) {
      // Another call already started loading
      await this.genresLoading;
      return;
    }

    this.genresLoading = (async () => {
      try {
        const [movieGenres, tvGenres] = await Promise.all([
          this.fetchGenres("movie").catch(() => []),
          this.fetchGenres("tv").catch(() => []),
        ]);
        [...movieGenres, ...tvGenres].forEach((genre) => {
          this.genres.set(genre.id, genre.name);
        });

        // If nothing was fetched, populate fallback
        if (this.genres.size === 0) {
          this.setFallbackGenres();
        }
        this.genresLoaded = true;
      } catch (err) {
        console.error("TMDB genres lazy load failed, using fallback:", err);
        this.setFallbackGenres();
        this.genresLoaded = true; // Prevent repeated attempts that would spam logs
      } finally {
        this.genresLoading = null;
      }
    })();

    await this.genresLoading;
  }

  private setFallbackGenres(): void {
    const fallbackGenres = [
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
      { id: 16, name: "Animation" },
      { id: 35, name: "Comedy" },
      { id: 80, name: "Crime" },
      { id: 99, name: "Documentary" },
      { id: 18, name: "Drama" },
      { id: 10751, name: "Family" },
      { id: 14, name: "Fantasy" },
      { id: 36, name: "History" },
      { id: 27, name: "Horror" },
      { id: 10402, name: "Music" },
      { id: 9648, name: "Mystery" },
      { id: 10749, name: "Romance" },
      { id: 878, name: "Sci-Fi" },
      { id: 10770, name: "TV Movie" },
      { id: 53, name: "Thriller" },
      { id: 10752, name: "War" },
      { id: 37, name: "Western" },
    ];

    fallbackGenres.forEach((genre) => {
      this.genres.set(genre.id, genre.name);
    });
  }

  private async fetchGenres(type: "movie" | "tv"): Promise<TMDBGenre[]> {
    const cacheKey = ApiCache.generateKey("genres", { type });
    const cached = this.cache.get<TMDBGenre[]>(cacheKey);

    if (cached) return cached;

    const response = await this.client.fetch<{ genres: TMDBGenre[] }>(
      `/genre/${type}/list?api_key=${API_KEYS.TMDB}&language=${BR_LOCALE.language}`
    );

    this.cache.set(cacheKey, response.genres, 86400); // Cache for 24 hours
    return response.genres;
  }

  async searchMovies(query: string, page: number = 1): Promise<TMDBMovie[]> {
    const cacheKey = ApiCache.generateKey("search-movies", { query, page });
    const cached = this.cache.get<TMDBMovie[]>(cacheKey);

    if (cached) return cached;

    const params = this.client.buildQueryString({
      api_key: API_KEYS.TMDB,
      language: BR_LOCALE.language,
      region: BR_LOCALE.region,
      query,
      page,
      include_adult: false,
    });

    const response = await this.client.fetch<{ results: TMDBMovie[] }>(
      `/search/movie?${params}`
    );

    this.cache.set(cacheKey, response.results);
    return response.results;
  }

  async searchTVShows(query: string, page: number = 1): Promise<TMDBTVShow[]> {
    const cacheKey = ApiCache.generateKey("search-tv", { query, page });
    const cached = this.cache.get<TMDBTVShow[]>(cacheKey);

    if (cached) return cached;

    const params = this.client.buildQueryString({
      api_key: API_KEYS.TMDB,
      language: BR_LOCALE.language,
      query,
      page,
    });

    const response = await this.client.fetch<{ results: TMDBTVShow[] }>(
      `/search/tv?${params}`
    );

    this.cache.set(cacheKey, response.results);
    return response.results;
  }

  async getMovieDetails(movieId: number): Promise<any> {
    const cacheKey = ApiCache.generateKey("movie-details", { movieId });
    const cached = this.cache.get<any>(cacheKey);

    if (cached) return cached;

    const params = this.client.buildQueryString({
      api_key: API_KEYS.TMDB,
      language: BR_LOCALE.language,
      append_to_response: "credits,release_dates",
    });

    const details = await this.client.fetch<any>(`/movie/${movieId}?${params}`);

    this.cache.set(cacheKey, details);
    return details;
  }

  async getTVShowDetails(tvId: number): Promise<any> {
    const cacheKey = ApiCache.generateKey("tv-details", { tvId });
    const cached = this.cache.get<any>(cacheKey);

    if (cached) return cached;

    const params = this.client.buildQueryString({
      api_key: API_KEYS.TMDB,
      language: BR_LOCALE.language,
      append_to_response: "credits,content_ratings",
    });

    const details = await this.client.fetch<any>(`/tv/${tvId}?${params}`);

    this.cache.set(cacheKey, details);
    return details;
  }

  async getProviders(type: "movie" | "tv", id: number): Promise<TMDBProviders> {
    const cacheKey = ApiCache.generateKey("providers", { type, id });
    const cached = this.cache.get<TMDBProviders>(cacheKey);

    if (cached) return cached;

    const params = this.client.buildQueryString({
      api_key: API_KEYS.TMDB,
    });

    const providers = await this.client.fetch<TMDBProviders>(
      `/${type}/${id}/watch/providers?${params}`
    );

    this.cache.set(cacheKey, providers, 3600); // Cache for 1 hour
    return providers;
  }

  async getPopular(
    type: "movie" | "tv",
    page: number = 1
  ): Promise<(TMDBMovie | TMDBTVShow)[]> {
    const cacheKey = ApiCache.generateKey("popular", { type, page });
    const cached = this.cache.get<(TMDBMovie | TMDBTVShow)[]>(cacheKey);

    if (cached) return cached;

    const params = this.client.buildQueryString({
      api_key: API_KEYS.TMDB,
      language: BR_LOCALE.language,
      region: BR_LOCALE.region,
      page,
    });

    const response = await this.client.fetch<{
      results: (TMDBMovie | TMDBTVShow)[];
    }>(`/${type}/popular?${params}`);

    this.cache.set(cacheKey, response.results, 1800); // Cache for 30 minutes
    return response.results;
  }

  async getTrending(
    mediaType: "all" | "movie" | "tv",
    timeWindow: "day" | "week" = "day"
  ): Promise<(TMDBMovie | TMDBTVShow)[]> {
    const cacheKey = ApiCache.generateKey("trending", {
      mediaType,
      timeWindow,
    });
    const cached = this.cache.get<(TMDBMovie | TMDBTVShow)[]>(cacheKey);

    if (cached) return cached;

    const params = this.client.buildQueryString({
      api_key: API_KEYS.TMDB,
      language: BR_LOCALE.language,
    });

    const response = await this.client.fetch<{
      results: (TMDBMovie | TMDBTVShow)[];
    }>(`/trending/${mediaType}/${timeWindow}?${params}`);

    this.cache.set(cacheKey, response.results, 1800); // Cache for 30 minutes
    return response.results;
  }

  // Helper method to convert TMDB data to our Movie interface
  convertToMovie(
    tmdbData: TMDBMovie | TMDBTVShow,
    type: "movie" | "series",
    providers: Provider[] = []
  ): Partial<Movie> {
    // Fire-and-forget ensure genres; if not yet loaded, genres may be empty for this call
    // but subsequent calls will have them. We don't await here to keep method synchronous
    // signature; callers that need genres immediately can await ensureGenresLoaded explicitly.
    if (!this.genresLoaded && !this.genresLoading) {
      this.ensureGenresLoaded();
    }
    const isMovie = type === "movie";
    const tmdbMovie = tmdbData as TMDBMovie;
    const tmdbShow = tmdbData as TMDBTVShow;

    return {
      id: `tmdb-${type}-${tmdbData.id}`,
      title: isMovie ? tmdbMovie.title : tmdbShow.name,
      originalTitle: isMovie
        ? tmdbMovie.original_title
        : tmdbShow.original_name,
      type,
      year: new Date(
        isMovie ? tmdbMovie.release_date : tmdbShow.first_air_date
      ).getFullYear(),
      genres: tmdbData.genre_ids
        .map((id) => this.genres.get(id))
        .filter((g): g is string => !!g),
      rating: tmdbData.vote_average,
      synopsis: tmdbData.overview,
      providers,
      popularity: Math.min(100, tmdbData.popularity),
      imageUrl: tmdbData.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
        : undefined,
    };
  }
}
