import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getCartManager } from "../utils/cart-manager";

export const viewCartTool = createTool({
  id: "view-cart",
  description:
    "View the current shopping cart contents with all items and total price.",
  inputSchema: z.object({
    threadId: z
      .string()
      .describe("The conversation thread ID for cart association"),
  }),
  outputSchema: z.object({
    cart: z.object({
      items: z.array(
        z.object({
          productId: z.string(),
          quantity: z.number(),
          product: z
            .object({
              id: z.string(),
              name: z.string(),
              category: z.string(),
              price: z.number(),
              unit: z.string(),
              description: z.string(),
            })
            .optional(),
        })
      ),
      total: z.number(),
    }),
    summary: z.string(),
  }),
  execute: async ({ context }) => {
    const { threadId } = context;

    const cartManager = getCartManager(threadId);
    const cart = cartManager.getCartWithProducts();
    const summary = cartManager.formatCartSummary();

    return {
      cart,
      summary,
    };
  },
});
