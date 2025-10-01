// Import the real movie service
import { movieService } from "../services/movie-service";

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  type: "movie" | "series";
  year: number;
  genres: string[];
  rating: number; // IMDB rating
  duration?: number; // in minutes for movies, or average episode duration for series
  seasons?: number; // for series
  episodes?: number; // total episodes for series
  director?: string;
  cast: string[];
  synopsis: string;
  providers: Provider[];
  mood: Mood[];
  language: string[];
  country: string[];
  ageRating: string;
  popularity: number; // 0-100
  releaseDate?: string;
  imageUrl?: string;
}

export interface Provider {
  name: "Netflix" | "Apple TV" | "HBO Max" | "Stremio";
  type: "stream" | "rent" | "buy";
  quality: "SD" | "HD" | "4K";
  price?: number; // for rent/buy options
}

export type Mood =
  | "happy"
  | "sad"
  | "excited"
  | "relaxed"
  | "romantic"
  | "adventurous"
  | "thoughtful"
  | "scared"
  | "nostalgic"
  | "energetic"
  | "melancholic"
  | "inspired";

// Helper functions for searching and filtering
// Now using real API data from TMDB and JustWatch
export async function searchMovies(
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
    // Use the real movie service to search
    return await movieService.searchMovies(query, filters);
  } catch (error) {
    console.error("Error searching movies:", error);
    // Fallback to empty array on error
    return [];
  }
}

export async function getMovieById(id: string): Promise<Movie | undefined> {
  try {
    return await movieService.getMovieById(id);
  } catch (error) {
    console.error("Error getting movie by ID:", error);
    return undefined;
  }
}

export async function getMoviesByMood(mood: Mood[]): Promise<Movie[]> {
  try {
    return await movieService.getMoviesByMood(mood);
  } catch (error) {
    console.error("Error getting movies by mood:", error);
    return [];
  }
}

export async function getMoviesByProvider(
  providers: Provider["name"][]
): Promise<Movie[]> {
  try {
    // Search for popular content and filter by providers
    return await movieService.searchMovies("", { providers });
  } catch (error) {
    console.error("Error getting movies by provider:", error);
    return [];
  }
}

export async function getTopRatedMovies(
  limit: number = 10,
  type?: "movie" | "series"
): Promise<Movie[]> {
  try {
    return await movieService.getTopRatedMovies(limit, type);
  } catch (error) {
    console.error("Error getting top rated movies:", error);
    return [];
  }
}

export async function getPopularMovies(
  limit: number = 10,
  type?: "movie" | "series"
): Promise<Movie[]> {
  try {
    return await movieService.getPopularMovies(limit, type);
  } catch (error) {
    console.error("Error getting popular movies:", error);
    return [];
  }
}

// Note: The mock data has been removed and replaced with real-time data from:
// - TMDB (The Movie Database) for movie/series information
// - JustWatch Brazil for streaming availability
//
// To use these APIs, you need to set the following environment variables:
// - TMDB_API_KEY: Your TMDB API key (get it from https://www.themoviedb.org/settings/api)
// - CACHE_TTL: Cache time-to-live in seconds (default: 3600)
// - RATE_LIMIT_REQUESTS: API rate limit (default: 100)
// - RATE_LIMIT_WINDOW: Rate limit window in seconds (default: 3600)
