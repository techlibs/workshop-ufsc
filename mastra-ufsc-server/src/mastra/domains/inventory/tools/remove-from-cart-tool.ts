import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getCartManager } from "../utils/cart-manager";

export const removeFromCartTool = createTool({
  id: "remove-from-cart",
  description:
    "Remove a product from the shopping cart or reduce its quantity. If no quantity is specified, removes the entire item.",
  inputSchema: z.object({
    productId: z.string().describe("The ID of the product to remove from cart"),
    quantity: z
      .number()
      .min(1)
      .optional()
      .describe("Quantity to remove (if not specified, removes entire item)"),
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
      const cart = cartManager.removeFromCart(productId, quantity);

      const message = quantity
        ? `Successfully removed ${quantity} item(s) from cart`
        : `Successfully removed item from cart`;

      return {
        success: true,
        message,
        cart,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to remove item from cart",
        cart: { items: [], total: 0 },
      };
    }
  },
});

