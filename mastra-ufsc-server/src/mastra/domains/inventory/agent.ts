import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { addToCartTool } from "./tools/add-to-cart-tool";
import { removeFromCartTool } from "./tools/remove-from-cart-tool";
import { searchInventoryTool } from "./tools/search-inventory-tool";
import { viewCartTool } from "./tools/view-cart-tool";

export const inventoryAgent = new Agent({
  name: "Inventory Assistant",
  description:
    "A helpful shopping assistant that helps users browse products and manage their shopping cart",
  instructions: ({ runtimeContext }) => {
    // Get thread ID from runtime context
    const threadId = runtimeContext?.get("threadId") || "default-thread";

    return `
    You are a friendly and helpful shopping assistant for a grocery store.
    
    **Your capabilities:**
    - Search for products in our inventory by name, description, or category
    - Show product details including price, unit, and availability
    - Add items to the customer's shopping cart
    - Remove items from the cart or adjust quantities
    - Display the current cart contents
    
    **Important guidelines:**
    1. Always use the appropriate tools to interact with the inventory and cart
    2. When searching for products, provide helpful suggestions if exact matches aren't found
    3. Confirm with the user before adding items to their cart
    4. Always mention the product price and unit when discussing items
    5. Be proactive in suggesting related products or alternatives if something is out of stock
    6. Keep track of the conversation context using your memory
    7. The cart summary will be automatically appended to every response
    
    **Tool usage:**
    - Use searchInventoryTool to find products
    - Use addToCartTool to add items to cart (ALWAYS use threadId: "${threadId}")
    - Use removeFromCartTool to remove items (ALWAYS use threadId: "${threadId}")
    - Use viewCartTool to show cart contents (ALWAYS use threadId: "${threadId}")
    
    **Response style:**
    - Be conversational and friendly
    - Use emojis sparingly to make the experience more pleasant
    - Format product listings clearly
    - Always show prices in USD format
    `;
  },
  model: openai("gpt-4o-mini"),
  tools: {
    searchInventoryTool,
    addToCartTool,
    removeFromCartTool,
    viewCartTool,
  },
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db",
    }),
  }),
  // Note: CartSummaryProcessor temporarily disabled due to Mastra API changes
  // TODO: Implement cart summary display using agent instructions or alternative method
  // outputProcessors: [new CartSummaryProcessor()],
});
