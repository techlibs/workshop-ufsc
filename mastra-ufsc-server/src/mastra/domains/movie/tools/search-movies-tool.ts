import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { searchMovies } from "../utils/movie-data";
import { ProviderManager } from "../utils/provider-manager";

export const searchMoviesTool = createTool({
  id: "search-movies",
  description:
    "Search for movies and series by title, genre, actors, directors, or any text. Can filter by type (movie/series), genres, providers, mood, rating, and year.",
  inputSchema: z.object({
    query: z
      .string()
      .describe("Search term for title, actor, director, or description"),
    type: z
      .enum(["movie", "series"])
      .optional()
      .describe("Filter by movie or series"),
    genres: z
      .array(z.string())
      .optional()
      .describe("Filter by genres (e.g., ['Action', 'Comedy'])"),
    providers: z
      .array(z.enum(["Netflix", "Apple TV", "HBO Max", "Stremio"]))
      .optional()
      .describe("Filter by streaming providers"),
    mood: z
      .array(
        z.enum([
          "happy",
          "sad",
          "excited",
          "relaxed",
          "romantic",
          "adventurous",
          "thoughtful",
          "scared",
          "nostalgic",
          "energetic",
          "melancholic",
          "inspired",
        ])
      )
      .optional()
      .describe("Filter by mood tags"),
    minRating: z
      .number()
      .min(0)
      .max(10)
      .optional()
      .describe("Minimum IMDB rating"),
    year: z.number().optional().describe("Filter by release year"),
    userId: z.string().describe("User ID for personalized filtering"),
    limit: z
      .number()
      .min(1)
      .max(20)
      .default(10)
      .describe("Maximum number of results"),
  }),
  outputSchema: z.object({
    results: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        type: z.enum(["movie", "series"]),
        year: z.number(),
        rating: z.number(),
        genres: z.array(z.string()),
        synopsis: z.string(),
        providers: z.array(
          z.object({
            name: z.string(),
            type: z.string(),
            quality: z.string(),
          })
        ),
        personalScore: z.number().optional(),
      })
    ),
    count: z.number(),
    filteredByProvider: z.boolean(),
  }),
  execute: async ({ context }) => {
    const {
      query,
      type,
      genres,
      providers,
      mood,
      minRating,
      year,
      userId,
      limit,
    } = context;

    // Search movies with filters - now async
    let results = await searchMovies(query, {
      type,
      genres,
      providers,
      mood,
      minRating,
      year,
    });

    // Apply user provider filtering if no specific providers requested
    const providerManager = new ProviderManager(userId);
    let filteredByProvider = false;

    if (!providers || providers.length === 0) {
      results = providerManager.filterMoviesByUserProviders(results);
      filteredByProvider = true;
    }

    // Calculate personalized scores
    const resultsWithScores = results.map((movie) => ({
      ...movie,
      personalScore: providerManager.getPersonalizedScore(movie),
    }));

    // Sort by personalized score
    resultsWithScores.sort((a, b) => b.personalScore - a.personalScore);

    // Limit results
    const limitedResults = resultsWithScores.slice(0, limit);

    return {
      results: limitedResults.map((movie) => ({
        id: movie.id,
        title: movie.title,
        type: movie.type,
        year: movie.year,
        rating: movie.rating,
        genres: movie.genres,
        synopsis: movie.synopsis,
        providers: movie.providers,
        personalScore: movie.personalScore,
      })),
      count: limitedResults.length,
      filteredByProvider,
    };
  },
});
