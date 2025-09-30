import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import {
  getProductsByCategory,
  searchInventory,
} from "../utils/inventory-data";

export const searchInventoryTool = createTool({
  id: "search-inventory",
  description:
    "Search for products in the store inventory by name, description, or category. Use this to help users find products they're looking for.",
  inputSchema: z.object({
    query: z
      .string()
      .optional()
      .describe("Search term to find products by name or description"),
    category: z
      .enum(["groceries", "food", "drinks", "fruits"])
      .optional()
      .describe("Filter results by product category"),
  }),
  outputSchema: z.object({
    products: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        category: z.string(),
        price: z.number(),
        unit: z.string(),
        stock: z.number(),
        description: z.string(),
      })
    ),
    count: z.number(),
  }),
  execute: async ({ context }) => {
    const { query, category } = context;

    let products;

    if (query) {
      products = searchInventory(query, category);
    } else if (category) {
      products = getProductsByCategory(category);
    } else {
      // If no query or category, return empty results
      products = [];
    }

    return {
      products,
      count: products.length,
    };
  },
});
