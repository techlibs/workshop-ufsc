import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { floripaBeaches } from "../data/beach-data";

export const beachDetailsTool = createTool({
  id: "get-beach-details",
  description:
    "Get detailed information about a specific beach in Florianópolis including surf conditions, facilities, and activities",
  inputSchema: z.object({
    beachName: z.string().describe("Name of the beach to get details for"),
  }),
  outputSchema: z.object({
    found: z.boolean(),
    beach: z
      .object({
        name: z.string(),
        region: z.string(),
        description: z.string(),
        characteristics: z.object({
          surfing: z.boolean(),
          surfQuality: z.string(),
          waves: z.string(),
          chilling: z.boolean(),
          familyFriendly: z.boolean(),
          infrastructure: z.string(),
          crowded: z.string(),
          waterQuality: z.string(),
        }),
        activities: z.array(z.string()),
        bestFor: z.array(z.string()),
        access: z.string(),
        highlights: z.array(z.string()),
        recommendations: z
          .array(z.string())
          .describe("Personalized recommendations for this beach"),
      })
      .optional(),
    similarBeaches: z
      .array(
        z.object({
          name: z.string(),
          similarity: z.string(),
        })
      )
      .optional()
      .describe("Similar beaches the user might also enjoy"),
  }),
  execute: async ({ context }) => {
    const { beachName } = context;

    // Find the beach (case-insensitive, partial match)
    const beach = floripaBeaches.find(
      (b) =>
        b.name.toLowerCase().includes(beachName.toLowerCase()) ||
        b.id
          .toLowerCase()
          .includes(beachName.toLowerCase().replace(/\s+/g, "-"))
    );

    if (!beach) {
      return {
        found: false,
      };
    }

    // Generate personalized recommendations
    const recommendations: string[] = [];

    if (beach.characteristics.surfing) {
      if (beach.characteristics.surfQuality === "beginner") {
        recommendations.push(
          "Perfect for learning to surf - consider taking a lesson at one of the local surf schools"
        );
      } else if (beach.characteristics.surfQuality === "pro") {
        recommendations.push(
          "Check surf forecasts before going - this break can be heavy"
        );
        recommendations.push("Best surfed at mid to high tide");
      }
    }

    if (beach.characteristics.infrastructure === "excellent") {
      recommendations.push(
        "Plenty of restaurants and bars nearby - great for a full day out"
      );
    } else if (beach.characteristics.infrastructure === "basic") {
      recommendations.push(
        "Bring water and snacks - limited facilities available"
      );
    }

    if (beach.characteristics.crowded === "high") {
      recommendations.push(
        "Arrive early to secure a good spot, especially on weekends"
      );
    } else if (beach.characteristics.crowded === "low") {
      recommendations.push(
        "Enjoy the tranquility - perfect for escaping the crowds"
      );
    }

    if (beach.access.includes("trail") || beach.access.includes("Difficult")) {
      recommendations.push(
        "Wear comfortable shoes for the hike and bring minimal gear"
      );
    }

    // Find similar beaches
    const similarBeaches = floripaBeaches
      .filter((b) => b.id !== beach.id)
      .map((b) => {
        let similarityScore = 0;
        const similarities: string[] = [];

        // Check surf quality match
        if (
          b.characteristics.surfQuality === beach.characteristics.surfQuality &&
          beach.characteristics.surfing
        ) {
          similarityScore += 3;
          similarities.push("similar surf conditions");
        }

        // Check region
        if (b.region === beach.region) {
          similarityScore += 2;
          similarities.push("same region");
        }

        // Check infrastructure
        if (
          b.characteristics.infrastructure ===
          beach.characteristics.infrastructure
        ) {
          similarityScore += 1;
          similarities.push("similar facilities");
        }

        // Check crowd levels
        if (b.characteristics.crowded === beach.characteristics.crowded) {
          similarityScore += 1;
          similarities.push("similar crowd levels");
        }

        // Check family friendly
        if (
          b.characteristics.familyFriendly ===
          beach.characteristics.familyFriendly
        ) {
          similarityScore += 1;
        }

        return {
          beach: b,
          score: similarityScore,
          similarity: similarities.join(", "),
        };
      })
      .filter((item) => item.score >= 3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => ({
        name: item.beach.name,
        similarity: item.similarity || "similar characteristics",
      }));

    return {
      found: true,
      beach: {
        name: beach.name,
        region: beach.region,
        description: beach.description,
        characteristics: beach.characteristics,
        activities: beach.activities,
        bestFor: beach.bestFor,
        access: beach.access,
        highlights: beach.highlights,
        recommendations,
      },
      similarBeaches: similarBeaches.length > 0 ? similarBeaches : undefined,
    };
  },
});
