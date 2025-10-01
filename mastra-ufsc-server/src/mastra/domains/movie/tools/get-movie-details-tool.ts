import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getMovieById } from "../utils/movie-data";
import {
  formatProviderOptions,
  ProviderManager,
} from "../utils/provider-manager";

export const getMovieDetailsTool = createTool({
  id: "get-movie-details",
  description:
    "Get detailed information about a specific movie or series including cast, synopsis, ratings, and where to watch it.",
  inputSchema: z.object({
    movieId: z.string().describe("The ID of the movie or series"),
    userId: z.string().describe("User ID for tracking watch history"),
  }),
  outputSchema: z.object({
    found: z.boolean(),
    movie: z
      .object({
        id: z.string(),
        title: z.string(),
        originalTitle: z.string().optional(),
        type: z.enum(["movie", "series"]),
        year: z.number(),
        genres: z.array(z.string()),
        rating: z.number(),
        duration: z.number().optional(),
        seasons: z.number().optional(),
        episodes: z.number().optional(),
        director: z.string().optional(),
        cast: z.array(z.string()),
        synopsis: z.string(),
        mood: z.array(z.string()),
        language: z.array(z.string()),
        country: z.array(z.string()),
        ageRating: z.string(),
        popularity: z.number(),
        imageUrl: z.string().optional(),
        providerOptions: z.string(),
        userCanWatch: z.boolean(),
      })
      .optional(),
  }),
  execute: async ({ context }) => {
    const { movieId, userId } = context;

    const movie = await getMovieById(movieId);

    if (!movie) {
      return {
        found: false,
      };
    }

    const providerManager = new ProviderManager(userId);
    const userProviders = providerManager.getProviders();

    // Check if user can watch this movie with their providers
    const userCanWatch = movie.providers.some(
      (provider) =>
        userProviders.includes(provider.name) && provider.type === "stream"
    );

    // Format provider options
    const providerOptions = formatProviderOptions(movie);

    return {
      found: true,
      movie: {
        id: movie.id,
        title: movie.title,
        originalTitle: movie.originalTitle,
        type: movie.type,
        year: movie.year,
        genres: movie.genres,
        rating: movie.rating,
        duration: movie.duration,
        seasons: movie.seasons,
        episodes: movie.episodes,
        director: movie.director,
        cast: movie.cast,
        synopsis: movie.synopsis,
        mood: movie.mood,
        language: movie.language,
        country: movie.country,
        ageRating: movie.ageRating,
        popularity: movie.popularity,
        imageUrl: movie.imageUrl,
        providerOptions,
        userCanWatch,
      },
    };
  },
});
