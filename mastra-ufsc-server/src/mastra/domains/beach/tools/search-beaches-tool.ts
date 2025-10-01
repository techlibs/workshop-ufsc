import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { floripaBeaches, searchBeaches } from "../data/beach-data";

export const searchBeachesTool = createTool({
  id: "search-beaches",
  description:
    "Search for beaches in Florianópolis based on user preferences like surfing, chilling, region, or specific activities",
  inputSchema: z.object({
    activity: z
      .enum(["surfing", "chilling", "both"])
      .optional()
      .describe("Main activity preference"),
    surfLevel: z
      .enum(["none", "beginner", "intermediate", "advanced", "pro"])
      .optional()
      .describe("Surfing skill level"),
    region: z
      .enum(["Norte", "Sul", "Leste", "Oeste"])
      .optional()
      .describe("Preferred region of the island"),
    searchQuery: z
      .string()
      .optional()
      .describe("Free text search for specific features or activities"),
    familyFriendly: z
      .boolean()
      .optional()
      .describe("Whether looking for family-friendly beaches"),
    infrastructure: z
      .enum(["basic", "moderate", "excellent"])
      .optional()
      .describe("Desired level of infrastructure"),
    crowdPreference: z
      .enum(["low", "moderate", "high"])
      .optional()
      .describe("Preference for crowd levels"),
    limit: z
      .number()
      .min(1)
      .max(10)
      .default(5)
      .describe("Maximum number of results to return"),
  }),
  outputSchema: z.object({
    beaches: z.array(
      z.object({
        name: z.string(),
        region: z.string(),
        description: z.string(),
        surfQuality: z.string(),
        infrastructure: z.string(),
        crowded: z.string(),
        bestFor: z.array(z.string()),
        highlights: z.array(z.string()),
        matchReason: z
          .string()
          .describe("Why this beach matches the search criteria"),
      })
    ),
    totalFound: z.number(),
    searchCriteria: z.string().describe("Summary of what was searched for"),
  }),
  execute: async ({ context }) => {
    const {
      activity,
      surfLevel,
      region,
      searchQuery,
      familyFriendly,
      infrastructure,
      crowdPreference,
      limit,
    } = context;

    let results = [...floripaBeaches];
    let searchCriteria: string[] = [];

    // Filter by activity
    if (activity && activity !== "both") {
      results = results.filter((beach) =>
        activity === "surfing"
          ? beach.characteristics.surfing
          : beach.characteristics.chilling
      );
      searchCriteria.push(`${activity} beaches`);
    }

    // Filter by surf level
    if (surfLevel && surfLevel !== "none") {
      results = results.filter(
        (beach) => beach.characteristics.surfQuality === surfLevel
      );
      searchCriteria.push(`${surfLevel} level surf`);
    }

    // Filter by region
    if (region) {
      results = results.filter((beach) => beach.region === region);
      searchCriteria.push(`in ${region} region`);
    }

    // Filter by family friendly
    if (familyFriendly !== undefined) {
      results = results.filter(
        (beach) => beach.characteristics.familyFriendly === familyFriendly
      );
      searchCriteria.push(
        familyFriendly ? "family-friendly" : "not necessarily family-friendly"
      );
    }

    // Filter by infrastructure
    if (infrastructure) {
      results = results.filter(
        (beach) => beach.characteristics.infrastructure === infrastructure
      );
      searchCriteria.push(`${infrastructure} infrastructure`);
    }

    // Filter by crowd preference
    if (crowdPreference) {
      results = results.filter(
        (beach) => beach.characteristics.crowded === crowdPreference
      );
      searchCriteria.push(`${crowdPreference} crowds`);
    }

    // Apply search query
    if (searchQuery) {
      const queryResults = searchBeaches(searchQuery);
      results = results.filter((beach) =>
        queryResults.some((qb) => qb.id === beach.id)
      );
      searchCriteria.push(`matching "${searchQuery}"`);
    }

    // Sort results by relevance
    results.sort((a, b) => {
      let scoreA = 0,
        scoreB = 0;

      // Prioritize exact activity matches
      if (activity === "surfing" && a.characteristics.surfing) scoreA += 2;
      if (activity === "surfing" && b.characteristics.surfing) scoreB += 2;
      if (activity === "chilling" && a.characteristics.chilling) scoreA += 2;
      if (activity === "chilling" && b.characteristics.chilling) scoreB += 2;

      // Prioritize better water quality
      if (a.characteristics.waterQuality === "excellent") scoreA += 1;
      if (b.characteristics.waterQuality === "excellent") scoreB += 1;

      return scoreB - scoreA;
    });

    // Limit results
    const limitedResults = results.slice(0, limit);

    // Format results with match reasons
    const formattedBeaches = limitedResults.map((beach) => {
      const matchReasons: string[] = [];

      if (activity === "surfing" && beach.characteristics.surfing) {
        matchReasons.push(
          `Great for ${beach.characteristics.surfQuality} level surfing`
        );
      }
      if (activity === "chilling" && beach.characteristics.chilling) {
        matchReasons.push("Perfect for relaxing");
      }
      if (region && beach.region === region) {
        matchReasons.push(`Located in ${region}`);
      }
      if (familyFriendly && beach.characteristics.familyFriendly) {
        matchReasons.push("Family-friendly");
      }
      if (
        infrastructure &&
        beach.characteristics.infrastructure === infrastructure
      ) {
        matchReasons.push(`${infrastructure} infrastructure`);
      }
      if (
        searchQuery &&
        beach.highlights.some((h) =>
          h.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ) {
        matchReasons.push(`Features ${searchQuery}`);
      }

      return {
        name: beach.name,
        region: beach.region,
        description: beach.description,
        surfQuality: beach.characteristics.surfQuality,
        infrastructure: beach.characteristics.infrastructure,
        crowded: beach.characteristics.crowded,
        bestFor: beach.bestFor,
        highlights: beach.highlights,
        matchReason:
          matchReasons.length > 0
            ? matchReasons.join(". ")
            : "Matches your search criteria",
      };
    });

    return {
      beaches: formattedBeaches,
      totalFound: results.length,
      searchCriteria:
        searchCriteria.length > 0
          ? `Searching for ${searchCriteria.join(", ")}`
          : "Showing all beaches",
    };
  },
});
