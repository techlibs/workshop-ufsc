import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import {
  analyzeMoodFromText,
  getGenresByMood,
  getMoodRecommendationPrompt,
  Mood,
} from "../utils/mood-mapper";
import { getMoviesByMood } from "../utils/movie-data";
import { ProviderManager } from "../utils/provider-manager";

export const recommendByMoodTool = createTool({
  id: "recommend-by-mood",
  description:
    "Get movie and series recommendations based on user's mood or emotional state. Can analyze mood from text or use specific mood tags.",
  inputSchema: z.object({
    moodText: z
      .string()
      .optional()
      .describe("User's description of their mood or what they want to feel"),
    moods: z
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
      .describe("Specific mood tags"),
    userId: z.string().describe("User ID for personalized recommendations"),
    type: z
      .enum(["movie", "series", "both"])
      .default("both")
      .describe("Filter by movie, series, or both"),
    limit: z
      .number()
      .min(1)
      .max(10)
      .default(5)
      .describe("Number of recommendations"),
  }),
  outputSchema: z.object({
    detectedMoods: z.array(z.string()),
    recommendedGenres: z.array(z.string()),
    moodDescription: z.string(),
    recommendations: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        type: z.enum(["movie", "series"]),
        year: z.number(),
        rating: z.number(),
        genres: z.array(z.string()),
        mood: z.array(z.string()),
        synopsis: z.string(),
        matchReason: z.string(),
        providers: z.array(
          z.object({
            name: z.string(),
            type: z.string(),
          })
        ),
      })
    ),
    insights: z.string(),
  }),
  execute: async ({ context }) => {
    const { moodText, moods, userId, type, limit } = context;

    // Determine moods from text or use provided moods
    let detectedMoods: Mood[] = moods || [];

    if (moodText && detectedMoods.length === 0) {
      detectedMoods = analyzeMoodFromText(moodText);
    }

    // Default to thoughtful if no mood detected
    if (detectedMoods.length === 0) {
      detectedMoods = ["thoughtful"];
    }

    // Get genres associated with moods
    const recommendedGenres = getGenresByMood(detectedMoods);
    const moodDescription = getMoodRecommendationPrompt(detectedMoods);

    // Get movies matching the moods - now async
    let recommendations = await getMoviesByMood(detectedMoods);

    // Filter by type if specified
    if (type !== "both") {
      recommendations = recommendations.filter((movie) => movie.type === type);
    }

    // Apply user provider filtering
    const providerManager = new ProviderManager(userId);
    recommendations =
      providerManager.filterMoviesByUserProviders(recommendations);

    // Score and sort recommendations
    const scoredRecommendations = recommendations.map((movie) => {
      const moodMatchCount = movie.mood.filter((m) =>
        detectedMoods.includes(m)
      ).length;
      const genreMatchCount = movie.genres.filter((g) =>
        recommendedGenres.includes(g)
      ).length;
      const personalScore = providerManager.getPersonalizedScore(movie);

      // Calculate total score
      const totalScore =
        moodMatchCount * 30 + genreMatchCount * 20 + personalScore;

      // Generate match reason
      const matchingMoods = movie.mood.filter((m) => detectedMoods.includes(m));
      const matchingGenres = movie.genres.filter((g) =>
        recommendedGenres.includes(g)
      );

      let matchReason = "";
      if (matchingMoods.length > 0) {
        matchReason += `Perfect for ${matchingMoods.join(" and ")} mood`;
      }
      if (matchingGenres.length > 0) {
        if (matchReason) matchReason += ". ";
        matchReason += `Features ${matchingGenres.slice(0, 2).join(" and ")}`;
      }

      return {
        movie,
        totalScore,
        matchReason: matchReason || "Recommended based on your preferences",
      };
    });

    // Sort by score and limit
    scoredRecommendations.sort((a, b) => b.totalScore - a.totalScore);
    const topRecommendations = scoredRecommendations.slice(0, limit);

    // Generate insights
    const insights = providerManager.getRecommendationInsights();

    return {
      detectedMoods,
      recommendedGenres,
      moodDescription,
      recommendations: topRecommendations.map(({ movie, matchReason }) => ({
        id: movie.id,
        title: movie.title,
        type: movie.type,
        year: movie.year,
        rating: movie.rating,
        genres: movie.genres,
        mood: movie.mood,
        synopsis: movie.synopsis,
        matchReason,
        providers: movie.providers.map((p) => ({
          name: p.name,
          type: p.type,
        })),
      })),
      insights,
    };
  },
});
