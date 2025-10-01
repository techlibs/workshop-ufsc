import { Mood, Movie, Provider } from "../utils/movie-data";
import { JustWatchApiClient } from "./justwatch-api";
import { TMDBApiClient } from "./tmdb-api";

export class MovieService {
  private tmdbClient: TMDBApiClient;
  private justWatchClient: JustWatchApiClient;

  constructor() {
    this.tmdbClient = new TMDBApiClient();
    this.justWatchClient = new JustWatchApiClient();
  }

  // Search for movies and series with real data
  async searchMovies(
    query: string,
    filters?: {
      type?: "movie" | "series";
      genres?: string[];
      providers?: Provider["name"][];
      mood?: Mood[];
      minRating?: number;
      year?: number;
    }
  ): Promise<Movie[]> {
    try {
      const results: Movie[] = [];

      // Search both movies and TV shows if no type filter
      if (!filters?.type || filters.type === "movie") {
        const tmdbMovies = await this.tmdbClient.searchMovies(query);

        for (const tmdbMovie of tmdbMovies) {
          // Skip if doesn't meet rating filter
          if (
            filters?.minRating &&
            tmdbMovie.vote_average < filters.minRating
          ) {
            continue;
          }

          // Skip if doesn't meet year filter
          if (filters?.year) {
            const releaseYear = new Date(tmdbMovie.release_date).getFullYear();
            if (releaseYear !== filters.year) continue;
          }

          // Get streaming providers from JustWatch
          const providers = await this.justWatchClient.getProvidersByTitle(
            tmdbMovie.title,
            new Date(tmdbMovie.release_date).getFullYear()
          );

          // Skip if doesn't have required providers
          if (filters?.providers?.length) {
            const hasProvider = providers.some((p) =>
              filters.providers!.includes(p.name)
            );
            if (!hasProvider) continue;
          }

          // Get full movie details
          const details = await this.tmdbClient.getMovieDetails(tmdbMovie.id);
          const movie = await this.convertTMDBToMovie(
            tmdbMovie,
            details,
            providers
          );

          // Skip if doesn't match genre filter
          if (filters?.genres?.length) {
            const hasGenre = movie.genres.some((g) =>
              filters.genres!.includes(g)
            );
            if (!hasGenre) continue;
          }

          // Skip if doesn't match mood filter
          if (filters?.mood?.length) {
            const hasMood = movie.mood.some((m) => filters.mood!.includes(m));
            if (!hasMood) continue;
          }

          results.push(movie);
        }
      }

      if (!filters?.type || filters.type === "series") {
        const tmdbShows = await this.tmdbClient.searchTVShows(query);

        for (const tmdbShow of tmdbShows) {
          // Similar filtering logic for TV shows
          if (filters?.minRating && tmdbShow.vote_average < filters.minRating) {
            continue;
          }

          if (filters?.year) {
            const releaseYear = new Date(tmdbShow.first_air_date).getFullYear();
            if (releaseYear !== filters.year) continue;
          }

          const providers = await this.justWatchClient.getProvidersByTitle(
            tmdbShow.name,
            new Date(tmdbShow.first_air_date).getFullYear()
          );

          if (filters?.providers?.length) {
            const hasProvider = providers.some((p) =>
              filters.providers!.includes(p.name)
            );
            if (!hasProvider) continue;
          }

          const details = await this.tmdbClient.getTVShowDetails(tmdbShow.id);
          const show = await this.convertTMDBToMovie(
            tmdbShow,
            details,
            providers,
            "series"
          );

          if (filters?.genres?.length) {
            const hasGenre = show.genres.some((g) =>
              filters.genres!.includes(g)
            );
            if (!hasGenre) continue;
          }

          if (filters?.mood?.length) {
            const hasMood = show.mood.some((m) => filters.mood!.includes(m));
            if (!hasMood) continue;
          }

          results.push(show);
        }
      }

      return results;
    } catch (error) {
      console.error("Error searching movies:", error);
      return [];
    }
  }

  // Get movie by ID (now using TMDB format)
  async getMovieById(id: string): Promise<Movie | undefined> {
    try {
      // Parse TMDB ID format: "tmdb-movie-123" or "tmdb-series-456"
      const parts = id.split("-");
      if (parts.length !== 3 || parts[0] !== "tmdb") {
        return undefined;
      }

      const type = parts[1] as "movie" | "series";
      const tmdbId = parseInt(parts[2]);

      if (type === "movie") {
        const details = await this.tmdbClient.getMovieDetails(tmdbId);
        const providers = await this.justWatchClient.getProvidersByTitle(
          details.title,
          new Date(details.release_date).getFullYear()
        );
        return this.convertTMDBToMovie(details, details, providers);
      } else {
        const details = await this.tmdbClient.getTVShowDetails(tmdbId);
        const providers = await this.justWatchClient.getProvidersByTitle(
          details.name,
          new Date(details.first_air_date).getFullYear()
        );
        return this.convertTMDBToMovie(details, details, providers, "series");
      }
    } catch (error) {
      console.error("Error getting movie by ID:", error);
      return undefined;
    }
  }

  // Get movies by mood
  async getMoviesByMood(moods: Mood[]): Promise<Movie[]> {
    try {
      const results: Movie[] = [];

      // Get popular content and filter by mood
      const [popularMovies, popularShows] = await Promise.all([
        this.tmdbClient.getPopular("movie"),
        this.tmdbClient.getPopular("tv"),
      ]);

      // Process movies
      for (const tmdbMovie of popularMovies.slice(0, 20)) {
        const providers = await this.justWatchClient.getProvidersByTitle(
          (tmdbMovie as any).title || (tmdbMovie as any).name
        );

        const movie = await this.convertTMDBToMovie(
          tmdbMovie,
          tmdbMovie,
          providers,
          "movie"
        );

        // Check if movie matches any of the requested moods
        if (movie.mood.some((m) => moods.includes(m))) {
          results.push(movie);
        }
      }

      // Process TV shows
      for (const tmdbShow of popularShows.slice(0, 20)) {
        const providers = await this.justWatchClient.getProvidersByTitle(
          (tmdbShow as any).name || (tmdbShow as any).title
        );

        const show = await this.convertTMDBToMovie(
          tmdbShow,
          tmdbShow,
          providers,
          "series"
        );

        if (show.mood.some((m) => moods.includes(m))) {
          results.push(show);
        }
      }

      return results;
    } catch (error) {
      console.error("Error getting movies by mood:", error);
      return [];
    }
  }

  // Get top rated movies
  async getTopRatedMovies(
    limit: number = 10,
    type?: "movie" | "series"
  ): Promise<Movie[]> {
    try {
      const results: Movie[] = [];

      if (!type || type === "movie") {
        const popularMovies = await this.tmdbClient.getPopular("movie");
        const sorted = popularMovies
          .sort((a, b) => b.vote_average - a.vote_average)
          .slice(0, limit);

        for (const tmdbMovie of sorted) {
          const providers = await this.justWatchClient.getProvidersByTitle(
            (tmdbMovie as any).title
          );
          const movie = await this.convertTMDBToMovie(
            tmdbMovie,
            tmdbMovie,
            providers,
            "movie"
          );
          results.push(movie);
        }
      }

      if (!type || type === "series") {
        const popularShows = await this.tmdbClient.getPopular("tv");
        const sorted = popularShows
          .sort((a, b) => b.vote_average - a.vote_average)
          .slice(0, limit);

        for (const tmdbShow of sorted) {
          const providers = await this.justWatchClient.getProvidersByTitle(
            (tmdbShow as any).name
          );
          const show = await this.convertTMDBToMovie(
            tmdbShow,
            tmdbShow,
            providers,
            "series"
          );
          results.push(show);
        }
      }

      return results.slice(0, limit);
    } catch (error) {
      console.error("Error getting top rated movies:", error);
      return [];
    }
  }

  // Get popular movies
  async getPopularMovies(
    limit: number = 10,
    type?: "movie" | "series"
  ): Promise<Movie[]> {
    try {
      const results: Movie[] = [];

      if (!type || type === "movie") {
        const trending = await this.tmdbClient.getTrending("movie", "week");

        for (const tmdbMovie of trending.slice(0, limit)) {
          const providers = await this.justWatchClient.getProvidersByTitle(
            (tmdbMovie as any).title
          );
          const movie = await this.convertTMDBToMovie(
            tmdbMovie,
            tmdbMovie,
            providers,
            "movie"
          );
          results.push(movie);
        }
      }

      if (!type || type === "series") {
        const trending = await this.tmdbClient.getTrending("tv", "week");

        for (const tmdbShow of trending.slice(0, limit)) {
          const providers = await this.justWatchClient.getProvidersByTitle(
            (tmdbShow as any).name
          );
          const show = await this.convertTMDBToMovie(
            tmdbShow,
            tmdbShow,
            providers,
            "series"
          );
          results.push(show);
        }
      }

      return results.slice(0, limit);
    } catch (error) {
      console.error("Error getting popular movies:", error);
      return [];
    }
  }

  // Helper method to convert TMDB data to our Movie interface
  private async convertTMDBToMovie(
    tmdbData: any,
    details: any,
    providers: Provider[],
    type: "movie" | "series" = "movie"
  ): Promise<Movie> {
    const isMovie = type === "movie";

    // Extract cast from credits
    const cast =
      details.credits?.cast?.slice(0, 5).map((c: any) => c.name) || [];

    // Extract director for movies
    const director = isMovie
      ? details.credits?.crew?.find((c: any) => c.job === "Director")?.name
      : undefined;

    // Determine mood based on genres and synopsis
    const moods = this.inferMoodsFromGenresAndSynopsis(
      details.genres?.map((g: any) => g.name) || [],
      details.overview || ""
    );

    // Get age rating
    const ageRating = this.getAgeRating(details, type);

    return {
      id: `tmdb-${type}-${tmdbData.id}`,
      title: isMovie ? details.title : details.name,
      originalTitle: isMovie ? details.original_title : details.original_name,
      type,
      year: new Date(
        isMovie ? details.release_date : details.first_air_date
      ).getFullYear(),
      genres: details.genres?.map((g: any) => g.name) || [],
      rating: details.vote_average || 0,
      duration: isMovie ? details.runtime : details.episode_run_time?.[0],
      seasons: !isMovie ? details.number_of_seasons : undefined,
      episodes: !isMovie ? details.number_of_episodes : undefined,
      director,
      cast,
      synopsis: details.overview || "",
      providers,
      mood: moods,
      language: details.spoken_languages?.map((l: any) => l.name) || [
        "English",
      ],
      country: details.production_countries?.map((c: any) => c.name) || [],
      ageRating,
      popularity: Math.min(100, details.popularity || 0),
      releaseDate: isMovie ? details.release_date : details.first_air_date,
      imageUrl: details.poster_path
        ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
        : undefined,
    };
  }

  // Infer moods from genres and synopsis
  private inferMoodsFromGenresAndSynopsis(
    genres: string[],
    synopsis: string
  ): Mood[] {
    const moods = new Set<Mood>();
    const genreLower = genres.map((g) => g.toLowerCase());
    const synopsisLower = synopsis.toLowerCase();

    // Genre-based mood inference
    if (genreLower.includes("comedy")) moods.add("happy");
    if (genreLower.includes("drama")) moods.add("thoughtful");
    if (genreLower.includes("romance")) moods.add("romantic");
    if (genreLower.includes("action") || genreLower.includes("adventure")) {
      moods.add("adventurous");
      moods.add("excited");
    }
    if (genreLower.includes("horror") || genreLower.includes("thriller")) {
      moods.add("scared");
    }
    if (genreLower.includes("sci-fi") || genreLower.includes("fantasy")) {
      moods.add("inspired");
    }

    // Synopsis-based mood inference
    if (synopsisLower.includes("love") || synopsisLower.includes("romance")) {
      moods.add("romantic");
    }
    if (synopsisLower.includes("sad") || synopsisLower.includes("tragic")) {
      moods.add("sad");
      moods.add("melancholic");
    }
    if (synopsisLower.includes("inspire") || synopsisLower.includes("hope")) {
      moods.add("inspired");
    }
    if (synopsisLower.includes("nostalg") || synopsisLower.includes("memory")) {
      moods.add("nostalgic");
    }

    // Default mood if none detected
    if (moods.size === 0) {
      moods.add("thoughtful");
    }

    return Array.from(moods);
  }

  // Get age rating from TMDB data
  private getAgeRating(details: any, type: "movie" | "series"): string {
    if (type === "movie") {
      // For movies, check release_dates for BR certification
      const brRelease = details.release_dates?.results?.find(
        (r: any) => r.iso_3166_1 === "BR"
      );
      if (brRelease?.release_dates?.[0]?.certification) {
        return brRelease.release_dates[0].certification;
      }
    } else {
      // For TV shows, check content_ratings
      const brRating = details.content_ratings?.results?.find(
        (r: any) => r.iso_3166_1 === "BR"
      );
      if (brRating?.rating) {
        return brRating.rating;
      }
    }

    // Fallback to US rating or general classification
    if (details.adult) return "18";
    if (details.vote_average > 7) return "14"; // Assume mature content for highly rated
    return "12"; // Default
  }
}

// Create singleton instance
export const movieService = new MovieService();
