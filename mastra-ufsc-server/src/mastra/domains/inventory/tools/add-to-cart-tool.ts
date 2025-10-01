import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getCartManager } from "../utils/cart-manager";

export const addToCartTool = createTool({
  id: "add-to-cart",
  description:
    "Add a product to the shopping cart. Requires a product ID and quantity. The cart is automatically associated with the conversation thread.",
  inputSchema: z.object({
    productId: z.string().describe("The ID of the product to add to cart"),
    quantity: z
      .number()
      .min(1)
      .default(1)
      .describe("Quantity to add (defaults to 1)"),
    threadId: z
      .string()
      .describe("The conversation thread ID for cart association"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
    cart: z.object({
      items: z.array(
        z.object({
          productId: z.string(),
          quantity: z.number(),
          product: z
            .object({
              id: z.string(),
              name: z.string(),
              price: z.number(),
              unit: z.string(),
            })
            .optional(),
        })
      ),
      total: z.number(),
    }),
  }),
  execute: async ({ context }) => {
    const { productId, quantity, threadId } = context;

    try {
      const cartManager = getCartManager(threadId);
      const cart = cartManager.addToCart(productId, quantity);

      return {
        success: true,
        message: `Successfully added ${quantity} item(s) to cart`,
        cart,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to add item to cart",
        cart: { items: [], total: 0 },
      };
    }
  },
});

