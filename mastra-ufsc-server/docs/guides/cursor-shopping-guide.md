# Create an interactive shopping agent
_Exported on 9/30/2025 at 11:36:26 GMT-3 from Cursor (1.7.23)_

---

**User**

read @agents.md and implement a new agent.

# context

we have a inventory from a store (grossary, food, drinks, fruits)

I Want to create an agent using Mastra AI to interact with me and help me find my and choose from it and add to my cart, keeping the list updated.

from every response to user, we need to send the updated list.

the agent should have memory.

---

**Cursor**

I'll help you create an inventory management agent using Mastra AI. Let me start by understanding the project structure and creating a plan.

Let me check the Mastra documentation for more details on tools and agents:

Now I'll create the inventory management agent with all the required tools and functionality. Let me start by creating a directory structure for the AI notes about this implementation.

```markdown
# Inventory Management Agent

## Overview
This document tracks the implementation of an inventory management agent using Mastra AI that helps users browse products, manage their shopping cart, and provides an updated cart list with every response.

## Features
- Search inventory by category or product name
- Add items to cart
- Remove items from cart
- View current cart
- Persistent cart state during conversation
- Memory for conversation history

## Architecture
- **Agent**: inventory-agent.ts
- **Tools**: search-inventory-tool.ts, add-to-cart-tool.ts, remove-from-cart-tool.ts, view-cart-tool.ts
- **Utils**: inventory-data.ts, cart-manager.ts
- **Memory**: LibSQL for conversation persistence

## Implementation Status
- [x] Project structure planning
- [x] Create inventory data structure
- [ ] Implement cart management utilities
- [ ] Create inventory tools
- [ ] Create inventory agent
- [ ] Update Mastra configuration
- [ ] Create test script
```

```typescript
export interface Product {
  id: string;
  name: string;
  category: 'groceries' | 'food' | 'drinks' | 'fruits';
  price: number;
  unit: string;
  stock: number;
  description: string;
}

export const inventory: Product[] = [
  // Groceries
  {
    id: 'groc-001',
    name: 'Rice',
    category: 'groceries',
    price: 4.99,
    unit: 'kg',
    stock: 50,
    description: 'Long grain white rice, perfect for everyday meals'
  },
  {
    id: 'groc-002',
    name: 'Pasta',
    category: 'groceries',
    price: 2.49,
    unit: '500g',
    stock: 75,
    description: 'Italian durum wheat pasta, various shapes available'
  },
  {
    id: 'groc-003',
    name: 'Olive Oil',
    category: 'groceries',
    price: 12.99,
    unit: '1L',
    stock: 30,
    description: 'Extra virgin olive oil, cold pressed'
  },
  {
    id: 'groc-004',
    name: 'Flour',
    category: 'groceries',
    price: 3.49,
    unit: 'kg',
    stock: 40,
    description: 'All-purpose wheat flour for baking and cooking'
  },
  {
    id: 'groc-005',
    name: 'Sugar',
    category: 'groceries',
    price: 2.99,
    unit: 'kg',
    stock: 60,
    description: 'Granulated white sugar'
  },

  // Food (Prepared/Ready-to-eat)
  {
    id: 'food-001',
    name: 'Sandwich',
    category: 'food',
    price: 5.99,
    unit: 'unit',
    stock: 20,
    description: 'Fresh turkey and cheese sandwich with lettuce and tomato'
  },
  {
    id: 'food-002',
    name: 'Pizza Margherita',
    category: 'food',
    price: 8.99,
    unit: 'unit',
    stock: 15,
    description: 'Classic Italian pizza with tomato, mozzarella, and basil'
  },
  {
    id: 'food-003',
    name: 'Caesar Salad',
    category: 'food',
    price: 6.49,
    unit: 'unit',
    stock: 25,
    description: 'Crisp romaine lettuce with Caesar dressing, croutons, and parmesan'
  },
  {
    id: 'food-004',
    name: 'Sushi Roll Set',
    category: 'food',
    price: 12.99,
    unit: '8 pieces',
    stock: 10,
    description: 'California and salmon roll combo'
  },

  // Drinks
  {
    id: 'drink-001',
    name: 'Orange Juice',
    category: 'drinks',
    price: 3.99,
    unit: '1L',
    stock: 40,
    description: 'Freshly squeezed orange juice, no sugar added'
  },
  {
    id: 'drink-002',
    name: 'Mineral Water',
    category: 'drinks',
    price: 1.49,
    unit: '1.5L',
    stock: 100,
    description: 'Natural spring water'
  },
  {
    id: 'drink-003',
    name: 'Green Tea',
    category: 'drinks',
    price: 4.99,
    unit: '20 bags',
    stock: 35,
    description: 'Organic green tea bags'
  },
  {
    id: 'drink-004',
    name: 'Coffee Beans',
    category: 'drinks',
    price: 15.99,
    unit: 'kg',
    stock: 25,
    description: 'Premium Arabica coffee beans, medium roast'
  },
  {
    id: 'drink-005',
    name: 'Coca Cola',
    category: 'drinks',
    price: 2.49,
    unit: '2L',
    stock: 50,
    description: 'Classic Coca Cola soft drink'
  },

  // Fruits
  {
    id: 'fruit-001',
    name: 'Apples',
    category: 'fruits',
    price: 3.99,
    unit: 'kg',
    stock: 80,
    description: 'Fresh red apples, sweet and crispy'
  },
  {
    id: 'fruit-002',
    name: 'Bananas',
    category: 'fruits',
    price: 2.49,
    unit: 'kg',
    stock: 100,
    description: 'Ripe yellow bananas, perfect for snacking'
  },
  {
    id: 'fruit-003',
    name: 'Oranges',
    category: 'fruits',
    price: 4.49,
    unit: 'kg',
    stock: 60,
    description: 'Juicy Valencia oranges'
  },
  {
    id: 'fruit-004',
    name: 'Strawberries',
    category: 'fruits',
    price: 5.99,
    unit: '500g',
    stock: 30,
    description: 'Fresh strawberries, sweet and ripe'
  },
  {
    id: 'fruit-005',
    name: 'Watermelon',
    category: 'fruits',
    price: 6.99,
    unit: 'unit',
    stock: 20,
    description: 'Large seedless watermelon, perfect for summer'
  },
  {
    id: 'fruit-006',
    name: 'Grapes',
    category: 'fruits',
    price: 4.99,
    unit: 'kg',
    stock: 40,
    description: 'Green seedless grapes'
  }
];

// Helper functions for searching inventory
export function searchInventory(query: string, category?: Product['category']): Product[] {
  const lowerQuery = query.toLowerCase();
  
  return inventory.filter(product => {
    const matchesQuery = product.name.toLowerCase().includes(lowerQuery) ||
                        product.description.toLowerCase().includes(lowerQuery);
    const matchesCategory = !category || product.category === category;
    
    return matchesQuery && matchesCategory;
  });
}

export function getProductById(id: string): Product | undefined {
  return inventory.find(product => product.id === id);
}

export function getProductsByCategory(category: Product['category']): Product[] {
  return inventory.filter(product => product.category === category);
}
```

```typescript
import { Product, getProductById } from './inventory-data';

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// In-memory cart storage (in production, this could be stored in a database)
const carts = new Map<string, Cart>();

export class CartManager {
  private threadId: string;

  constructor(threadId: string) {
    this.threadId = threadId;
  }

  private getCart(): Cart {
    if (!carts.has(this.threadId)) {
      carts.set(this.threadId, { items: [], total: 0 });
    }
    return carts.get(this.threadId)!;
  }

  private saveCart(cart: Cart): void {
    carts.set(this.threadId, cart);
  }

  private calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => {
      const product = getProductById(item.productId);
      if (product) {
        return total + (product.price * item.quantity);
      }
      return total;
    }, 0);
  }

  addToCart(productId: string, quantity: number = 1): Cart {
    const cart = this.getCart();
    const product = getProductById(productId);

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    if (product.stock < quantity) {
      throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

    if (existingItemIndex >= 0) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ productId, quantity });
    }

    cart.total = this.calculateTotal(cart.items);
    this.saveCart(cart);

    return this.getCartWithProducts();
  }

  removeFromCart(productId: string, quantity?: number): Cart {
    const cart = this.getCart();
    const itemIndex = cart.items.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
      throw new Error(`Product with ID ${productId} not found in cart`);
    }

    if (quantity === undefined || cart.items[itemIndex].quantity <= quantity) {
      // Remove entire item
      cart.items.splice(itemIndex, 1);
    } else {
      // Reduce quantity
      cart.items[itemIndex].quantity -= quantity;
    }

    cart.total = this.calculateTotal(cart.items);
    this.saveCart(cart);

    return this.getCartWithProducts();
  }

  clearCart(): Cart {
    const cart = { items: [], total: 0 };
    this.saveCart(cart);
    return cart;
  }

  getCartWithProducts(): Cart {
    const cart = this.getCart();
    const itemsWithProducts = cart.items.map(item => ({
      ...item,
      product: getProductById(item.productId)
    }));

    return {
      ...cart,
      items: itemsWithProducts
    };
  }

  formatCartSummary(): string {
    const cart = this.getCartWithProducts();
    
    if (cart.items.length === 0) {
      return "🛒 Your cart is empty.";
    }

    let summary = "🛒 **Current Cart:**\n\n";
    
    cart.items.forEach((item, index) => {
      if (item.product) {
        const itemTotal = item.product.price * item.quantity;
        summary += `${index + 1}. **${item.product.name}** - ${item.quantity} ${item.product.unit} × $${item.product.price.toFixed(2)} = $${itemTotal.toFixed(2)}\n`;
      }
    });

    summary += `\n**Total: $${cart.total.toFixed(2)}**`;
    
    return summary;
  }
}

// Helper function to get or create cart manager for a thread
export function getCartManager(threadId: string): CartManager {
  return new CartManager(threadId);
}
```

```typescript
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { searchInventory, getProductsByCategory } from "../utils/inventory-data";

export const searchInventoryTool = createTool({
  id: "search-inventory",
  description: "Search for products in the store inventory by name, description, or category. Use this to help users find products they're looking for.",
  inputSchema: z.object({
    query: z.string().optional().describe("Search term to find products by name or description"),
    category: z.enum(['groceries', 'food', 'drinks', 'fruits']).optional().describe("Filter results by product category")
  }),
  outputSchema: z.object({
    products: z.array(z.object({
      id: z.string(),
      name: z.string(),
      category: z.string(),
      price: z.number(),
      unit: z.string(),
      stock: z.number(),
      description: z.string()
    })),
    count: z.number()
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
      count: products.length
    };
  }
});
```

```typescript
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getCartManager } from "../utils/cart-manager";

export const addToCartTool = createTool({
  id: "add-to-cart",
  description: "Add a product to the shopping cart. Requires a product ID and quantity. The cart is automatically associated with the conversation thread.",
  inputSchema: z.object({
    productId: z.string().describe("The ID of the product to add to cart"),
    quantity: z.number().min(1).default(1).describe("Quantity to add (defaults to 1)"),
    threadId: z.string().describe("The conversation thread ID for cart association")
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
    cart: z.object({
      items: z.array(z.object({
        productId: z.string(),
        quantity: z.number(),
        product: z.object({
          id: z.string(),
          name: z.string(),
          price: z.number(),
          unit: z.string()
        }).optional()
      })),
      total: z.number()
    })
  }),
  execute: async ({ context }) => {
    const { productId, quantity, threadId } = context;

    try {
      const cartManager = getCartManager(threadId);
      const cart = cartManager.addToCart(productId, quantity);
      
      return {
        success: true,
        message: `Successfully added ${quantity} item(s) to cart`,
        cart
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to add item to cart',
        cart: { items: [], total: 0 }
      };
    }
  }
});
```

```typescript
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getCartManager } from "../utils/cart-manager";

export const removeFromCartTool = createTool({
  id: "remove-from-cart",
  description: "Remove a product from the shopping cart or reduce its quantity. If no quantity is specified, removes the entire item.",
  inputSchema: z.object({
    productId: z.string().describe("The ID of the product to remove from cart"),
    quantity: z.number().min(1).optional().describe("Quantity to remove (if not specified, removes entire item)"),
    threadId: z.string().describe("The conversation thread ID for cart association")
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
    cart: z.object({
      items: z.array(z.object({
        productId: z.string(),
        quantity: z.number(),
        product: z.object({
          id: z.string(),
          name: z.string(),
          price: z.number(),
          unit: z.string()
        }).optional()
      })),
      total: z.number()
    })
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
        cart
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to remove item from cart',
        cart: { items: [], total: 0 }
      };
    }
  }
});
```

```typescript
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getCartManager } from "../utils/cart-manager";

export const viewCartTool = createTool({
  id: "view-cart",
  description: "View the current shopping cart contents with all items and total price.",
  inputSchema: z.object({
    threadId: z.string().describe("The conversation thread ID for cart association")
  }),
  outputSchema: z.object({
    cart: z.object({
      items: z.array(z.object({
        productId: z.string(),
        quantity: z.number(),
        product: z.object({
          id: z.string(),
          name: z.string(),
          category: z.string(),
          price: z.number(),
          unit: z.string(),
          description: z.string()
        }).optional()
      })),
      total: z.number()
    }),
    summary: z.string()
  }),
  execute: async ({ context }) => {
    const { threadId } = context;

    const cartManager = getCartManager(threadId);
    const cart = cartManager.getCartWithProducts();
    const summary = cartManager.formatCartSummary();
    
    return {
      cart,
      summary
    };
  }
});
```

```typescript
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { searchInventoryTool } from "../tools/search-inventory-tool";
import { addToCartTool } from "../tools/add-to-cart-tool";
import { removeFromCartTool } from "../tools/remove-from-cart-tool";
import { viewCartTool } from "../tools/view-cart-tool";
import { getCartManager } from "../utils/cart-manager";
import { Processor } from "@mastra/core/processors";

// Custom processor to append cart summary to every response
class CartSummaryProcessor implements Processor {
  async processOutputResult(result: any, context: any): Promise<any> {
    // Extract thread ID from context or memory configuration
    const threadId = context?.options?.memory?.thread || 'default-thread';
    
    if (typeof threadId === 'object' && 'id' in threadId) {
      const cartManager = getCartManager(threadId.id);
      const cartSummary = cartManager.formatCartSummary();
      
      // Append cart summary to the text response
      if (result?.text) {
        result.text = `${result.text}\n\n---\n\n${cartSummary}`;
      }
    }
    
    return result;
  }
}

export const inventoryAgent = new Agent({
  name: "Inventory Assistant",
  description: "A helpful shopping assistant that helps users browse products and manage their shopping cart",
  instructions: `
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
    - Use addToCartTool to add items to cart (always pass the threadId)
    - Use removeFromCartTool to remove items (always pass the threadId)
    - Use viewCartTool to show cart contents (always pass the threadId)
    
    **Response style:**
    - Be conversational and friendly
    - Use emojis sparingly to make the experience more pleasant
    - Format product listings clearly
    - Always show prices in USD format
  `,
  model: openai("gpt-4o-mini"),
  tools: { 
    searchInventoryTool, 
    addToCartTool, 
    removeFromCartTool, 
    viewCartTool 
  },
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db",
    }),
  }),
  outputProcessors: [new CartSummaryProcessor()],
});
```

```typescript
import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";
import { weatherAgent } from "./agents/weather-agent";
import { weatherWorkflow } from "./workflows/weather-workflow";
import { inventoryAgent } from "./agents/inventory-agent";

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent, inventoryAgent },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});

```

```typescript
import { mastra } from "./src/mastra";

async function testInventoryAgent() {
  console.log("🛒 Testing Inventory Agent\n");

  const agent = mastra.getAgent("inventoryAgent");
  
  if (!agent) {
    console.error("❌ Inventory agent not found!");
    return;
  }

  // Simulate a shopping conversation
  const threadId = `test-thread-${Date.now()}`;
  const resource = "test-user";

  try {
    // Test 1: Search for fruits
    console.log("1️⃣ Searching for fruits...\n");
    const response1 = await agent.generate(
      "Hi! I'm looking for some fresh fruits. What do you have available?",
      {
        memory: {
          thread: { id: threadId },
          resource: resource
        }
      }
    );
    console.log("Assistant:", response1.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 2: Add items to cart
    console.log("2️⃣ Adding items to cart...\n");
    const response2 = await agent.generate(
      "I'd like to add 2 kg of apples and 1 kg of bananas to my cart please.",
      {
        memory: {
          thread: { id: threadId },
          resource: resource
        }
      }
    );
    console.log("Assistant:", response2.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 3: Search for drinks
    console.log("3️⃣ Searching for drinks...\n");
    const response3 = await agent.generate(
      "What drinks do you have? I'm looking for something refreshing.",
      {
        memory: {
          thread: { id: threadId },
          resource: resource
        }
      }
    );
    console.log("Assistant:", response3.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 4: Add more items
    console.log("4️⃣ Adding more items...\n");
    const response4 = await agent.generate(
      "Add 2 bottles of orange juice to my cart.",
      {
        memory: {
          thread: { id: threadId },
          resource: resource
        }
      }
    );
    console.log("Assistant:", response4.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 5: Remove item
    console.log("5️⃣ Removing an item...\n");
    const response5 = await agent.generate(
      "Actually, I changed my mind about the bananas. Please remove them from my cart.",
      {
        memory: {
          thread: { id: threadId },
          resource: resource
        }
      }
    );
    console.log("Assistant:", response5.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 6: View final cart
    console.log("6️⃣ Viewing final cart...\n");
    const response6 = await agent.generate(
      "Can you show me what's in my cart now?",
      {
        memory: {
          thread: { id: threadId },
          resource: resource
        }
      }
    );
    console.log("Assistant:", response6.text);

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Run the test
testInventoryAgent().catch(console.error);
```

```typescript
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { searchInventoryTool } from "../tools/search-inventory-tool";
import { addToCartTool } from "../tools/add-to-cart-tool";
import { removeFromCartTool } from "../tools/remove-from-cart-tool";
import { viewCartTool } from "../tools/view-cart-tool";
import { getCartManager } from "../utils/cart-manager";
import { Processor } from "@mastra/core/processors";

// Custom processor to append cart summary to every response
class CartSummaryProcessor implements Processor {
  async processOutputResult(result: any, context: any): Promise<any> {
    // Extract thread ID from context or memory configuration
    const threadId = context?.options?.memory?.thread || 'default-thread';
    
    if (typeof threadId === 'object' && 'id' in threadId) {
      const cartManager = getCartManager(threadId.id);
      const cartSummary = cartManager.formatCartSummary();
      
      // Append cart summary to the text response
      if (result?.text) {
        result.text = `${result.text}\n\n---\n\n${cartSummary}`;
      }
    }
    
    return result;
  }
}

export const inventoryAgent = new Agent({
  name: "Inventory Assistant",
  description: "A helpful shopping assistant that helps users browse products and manage their shopping cart",
  instructions: ({ runtimeContext }) => {
    // Get thread ID from runtime context
    const threadId = runtimeContext?.get('threadId') || 'default-thread';
    
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
    viewCartTool 
  },
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db",
    }),
  }),
  outputProcessors: [new CartSummaryProcessor()],
});

```

```typescript
import { mastra } from "./src/mastra";
import { RuntimeContext } from "@mastra/core/runtime-context";

async function testInventoryAgent() {
  console.log("🛒 Testing Inventory Agent\n");

  const agent = mastra.getAgent("inventoryAgent");
  
  if (!agent) {
    console.error("❌ Inventory agent not found!");
    return;
  }

  // Simulate a shopping conversation
  const threadId = `test-thread-${Date.now()}`;
  const resource = "test-user";
  
  // Create runtime context with thread ID
  const runtimeContext = new RuntimeContext();
  runtimeContext.set('threadId', threadId);

  try {
    // Test 1: Search for fruits
    console.log("1️⃣ Searching for fruits...\n");
    const response1 = await agent.generate(
      "Hi! I'm looking for some fresh fruits. What do you have available?",
      {
        memory: {
          thread: { id: threadId },
          resource: resource
        },
        runtimeContext
      }
    );
    console.log("Assistant:", response1.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 2: Add items to cart
    console.log("2️⃣ Adding items to cart...\n");
    const response2 = await agent.generate(
      "I'd like to add 2 kg of apples and 1 kg of bananas to my cart please.",
      {
        memory: {
          thread: { id: threadId },
          resource: resource
        }
      }
    );
    console.log("Assistant:", response2.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 3: Search for drinks
    console.log("3️⃣ Searching for drinks...\n");
    const response3 = await agent.generate(
      "What drinks do you have? I'm looking for something refreshing.",
      {
        memory: {
          thread: { id: threadId },
          resource: resource
        }
      }
    );
    console.log("Assistant:", response3.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 4: Add more items
    console.log("4️⃣ Adding more items...\n");
    const response4 = await agent.generate(
      "Add 2 bottles of orange juice to my cart.",
      {
        memory: {
          thread: { id: threadId },
          resource: resource
        }
      }
    );
    console.log("Assistant:", response4.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 5: Remove item
    console.log("5️⃣ Removing an item...\n");
    const response5 = await agent.generate(
      "Actually, I changed my mind about the bananas. Please remove them from my cart.",
      {
        memory: {
          thread: { id: threadId },
          resource: resource
        }
      }
    );
    console.log("Assistant:", response5.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 6: View final cart
    console.log("6️⃣ Viewing final cart...\n");
    const response6 = await agent.generate(
      "Can you show me what's in my cart now?",
      {
        memory: {
          thread: { id: threadId },
          resource: resource
        }
      }
    );
    console.log("Assistant:", response6.text);

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Run the test
testInventoryAgent().catch(console.error);

```

```typescript
import { mastra } from "./src/mastra";
import { RuntimeContext } from "@mastra/core/runtime-context";

async function testInventoryAgent() {
  console.log("🛒 Testing Inventory Agent\n");

  const agent = mastra.getAgent("inventoryAgent");
  
  if (!agent) {
    console.error("❌ Inventory agent not found!");
    return;
  }

  // Simulate a shopping conversation
  const threadId = `test-thread-${Date.now()}`;
  const resource = "test-user";
  
  // Create runtime context with thread ID
  const runtimeContext = new RuntimeContext();
  runtimeContext.set('threadId', threadId);

  try {
    // Test 1: Search for fruits
    console.log("1️⃣ Searching for fruits...\n");
    const response1 = await agent.generate(
      "Hi! I'm looking for some fresh fruits. What do you have available?",
      {
        memory: {
          thread: { id: threadId },
          resource: resource
        },
        runtimeContext
      }
    );
    console.log("Assistant:", response1.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 2: Add items to cart
    console.log("2️⃣ Adding items to cart...\n");
    const response2 = await agent.generate(
      "I'd like to add 2 kg of apples and 1 kg of bananas to my cart please.",
      {
        memory: {
          thread: { id: threadId },
          resource: resource
        },
        runtimeContext
      }
    );
    console.log("Assistant:", response2.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 3: Search for drinks
    console.log("3️⃣ Searching for drinks...\n");
    const response3 = await agent.generate(
      "What drinks do you have? I'm looking for something refreshing.",
      {
        memory: {
          thread: { id: threadId },
          resource: resource
        },
        runtimeContext
      }
    );
    console.log("Assistant:", response3.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 4: Add more items
    console.log("4️⃣ Adding more items...\n");
    const response4 = await agent.generate(
      "Add 2 bottles of orange juice to my cart.",
      {
        memory: {
          thread: { id: threadId },
          resource: resource
        },
        runtimeContext
      }
    );
    console.log("Assistant:", response4.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 5: Remove item
    console.log("5️⃣ Removing an item...\n");
    const response5 = await agent.generate(
      "Actually, I changed my mind about the bananas. Please remove them from my cart.",
      {
        memory: {
          thread: { id: threadId },
          resource: resource
        },
        runtimeContext
      }
    );
    console.log("Assistant:", response5.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 6: View final cart
    console.log("6️⃣ Viewing final cart...\n");
    const response6 = await agent.generate(
      "Can you show me what's in my cart now?",
      {
        memory: {
          thread: { id: threadId },
          resource: resource
        },
        runtimeContext
      }
    );
    console.log("Assistant:", response6.text);

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Run the test
testInventoryAgent().catch(console.error);

```

```markdown
# Inventory Management Agent

A shopping assistant agent built with Mastra AI that helps users browse products and manage their shopping cart.

## Features

- 🔍 **Product Search**: Search for products by name, description, or category
- 🛒 **Cart Management**: Add, remove, and view items in your shopping cart
- 💬 **Natural Conversation**: Interact naturally with the assistant using everyday language
- 📝 **Memory**: Maintains conversation history using LibSQL storage
- 🔄 **Cart Updates**: Automatically shows updated cart summary after every response

## Available Product Categories

- **Groceries**: Rice, pasta, olive oil, flour, sugar
- **Food**: Ready-to-eat items like sandwiches, pizza, salads, sushi
- **Drinks**: Orange juice, water, tea, coffee, soft drinks
- **Fruits**: Apples, bananas, oranges, strawberries, watermelon, grapes

## Usage

### Running the Test Script

```bash
cd mastra-ufsc-server
pnpm tsx test-inventory-agent.ts
```

### Using with Mastra Dev

```bash
cd mastra-ufsc-server
pnpm mastra dev
```

Then interact with the inventory agent through the Mastra playground.

### Example Conversations

**Finding Products:**
- "What fruits do you have?"
- "Show me all drinks"
- "I'm looking for pasta"
- "Do you have any organic products?"

**Managing Cart:**
- "Add 2 kg of apples to my cart"
- "I want 3 bottles of orange juice"
- "Remove the bananas from my cart"
- "What's in my cart?"
- "Clear my cart"

## Technical Details

### Agent Configuration

The inventory agent is configured with:
- **Model**: OpenAI GPT-4o-mini
- **Memory**: LibSQL storage for conversation persistence
- **Output Processor**: Custom processor that appends cart summary to every response

### Tools

1. **searchInventoryTool**: Search products by query or category
2. **addToCartTool**: Add items to the shopping cart
3. **removeFromCartTool**: Remove items or reduce quantities
4. **viewCartTool**: Display current cart contents

### Cart Management

- Cart state is maintained in-memory per conversation thread
- Each thread has its own isolated cart
- Cart totals are automatically calculated
- Stock validation prevents over-ordering

## Architecture

```
src/mastra/
├── agents/
│   └── inventory-agent.ts      # Main agent definition
├── tools/
│   ├── search-inventory-tool.ts
│   ├── add-to-cart-tool.ts
│   ├── remove-from-cart-tool.ts
│   └── view-cart-tool.ts
├── utils/
│   ├── inventory-data.ts       # Product database
│   └── cart-manager.ts         # Cart state management
└── index.ts                    # Mastra configuration
```

## Extending the Agent

### Adding New Products

Edit `src/mastra/utils/inventory-data.ts` to add new products:

```typescript
{
  id: 'unique-id',
  name: 'Product Name',
  category: 'category',
  price: 9.99,
  unit: 'kg',
  stock: 50,
  description: 'Product description'
}
```

### Adding New Features

1. Create new tools in `src/mastra/tools/`
2. Update agent instructions in `inventory-agent.ts`
3. Register tools with the agent

### Persistence

To persist cart data across server restarts:
1. Replace in-memory Map with database storage
2. Update CartManager to use persistent storage
3. Consider using Mastra's storage system
```

```markdown
# Inventory Agent Implementation Summary

## Overview
Successfully implemented a complete inventory management agent using Mastra AI with all requested features.

## Implemented Components

### 1. Data Structure (`inventory-data.ts`)
- Created Product interface with all required fields
- Mock inventory with 20+ products across 4 categories:
  - Groceries (rice, pasta, oil, flour, sugar)
  - Food (sandwiches, pizza, salads, sushi)
  - Drinks (juice, water, tea, coffee, soda)
  - Fruits (apples, bananas, oranges, strawberries, etc.)
- Helper functions for searching and filtering

### 2. Cart Management (`cart-manager.ts`)
- Thread-based cart isolation (each conversation has its own cart)
- In-memory storage using Map data structure
- Features:
  - Add items with quantity validation
  - Remove items (partial or complete)
  - Automatic total calculation
  - Cart summary formatting
  - Stock validation

### 3. Tools
- **search-inventory-tool.ts**: Search by query and/or category
- **add-to-cart-tool.ts**: Add products with quantity, includes thread ID
- **remove-from-cart-tool.ts**: Remove items or reduce quantities
- **view-cart-tool.ts**: Display cart contents with formatted summary

### 4. Inventory Agent (`inventory-agent.ts`)
- Uses OpenAI GPT-4o-mini model
- Memory persistence with LibSQL
- Dynamic instructions that include thread ID for tools
- Custom output processor that appends cart summary to every response
- Natural language interface for shopping interactions

### 5. Integration
- Updated Mastra configuration to register the inventory agent
- Created test script demonstrating all features
- Comprehensive README with usage instructions

## Key Features Achieved
✅ Browse inventory by category or search
✅ Add/remove items from cart
✅ Persistent cart state per conversation thread
✅ Updated cart summary with every response
✅ Memory for conversation history
✅ Natural language interaction
✅ Stock validation
✅ Price calculations

## Architecture Decisions
1. **Thread-based Cart Isolation**: Each conversation thread has its own cart
2. **In-memory Storage**: Quick implementation, can be replaced with persistent storage
3. **Output Processor**: Ensures cart summary is always visible
4. **Runtime Context**: Used to pass thread ID to agent instructions
5. **Tool Design**: Each tool has single responsibility with clear schemas

## Testing
Created comprehensive test script that demonstrates:
- Product search
- Adding items to cart
- Viewing different categories
- Removing items
- Final cart display

## Next Steps (Optional Enhancements)
1. Persist cart data to database
2. Add checkout functionality
3. Implement user authentication
4. Add product recommendations
5. Support for discounts/coupons
6. Order history tracking
```

```markdown
# Inventory Management Agent

## Overview
This document tracks the implementation of an inventory management agent using Mastra AI that helps users browse products, manage their shopping cart, and provides an updated cart list with every response.

## Features
- Search inventory by category or product name
- Add items to cart
- Remove items from cart
- View current cart
- Persistent cart state during conversation
- Memory for conversation history

## Architecture
- **Agent**: inventory-agent.ts
- **Tools**: search-inventory-tool.ts, add-to-cart-tool.ts, remove-from-cart-tool.ts, view-cart-tool.ts
- **Utils**: inventory-data.ts, cart-manager.ts
- **Memory**: LibSQL for conversation persistence

## Implementation Status
- [x] Project structure planning
- [x] Create inventory data structure
- [x] Implement cart management utilities
- [x] Create inventory tools
- [x] Create inventory agent
- [x] Update Mastra configuration
- [x] Create test script
- [x] Documentation and testing

```

## 🎉 Inventory Management Agent Implementation Complete!

I've successfully implemented a comprehensive inventory management agent using Mastra AI with all the requested features:

### ✅ What was built:

1. **Inventory System**
   - 20+ products across 4 categories (groceries, food, drinks, fruits)
   - Product search by name, description, or category
   - Stock tracking and validation

2. **Shopping Cart**
   - Thread-isolated carts (each conversation has its own cart)
   - Add/remove items with quantity management
   - Automatic price calculations
   - Cart summary included in every response

3. **AI Agent**
   - Natural language interface for shopping
   - Memory persistence using LibSQL
   - Integrated with 4 specialized tools
   - Friendly, conversational responses

4. **Tools Created**
   - `search-inventory-tool`: Find products
   - `add-to-cart-tool`: Add items to cart
   - `remove-from-cart-tool`: Remove or reduce items
   - `view-cart-tool`: Display cart contents

### 📁 Project Structure:
```
mastra-ufsc-server/
├── src/mastra/
│   ├── agents/inventory-agent.ts       # Main agent
│   ├── tools/                         # All cart & inventory tools
│   ├── utils/                         # Cart manager & inventory data
│   └── index.ts                       # Updated configuration
├── test-inventory-agent.ts            # Test script
└── README_INVENTORY_AGENT.md          # Documentation
```

### 🚀 Running the Agent:

```bash
# Test the agent
cd mastra-ufsc-server
pnpm tsx test-inventory-agent.ts

# Or use Mastra dev environment
pnpm mastra dev
```

### 💬 Example Usage:
- "Show me your fruits"
- "Add 2 kg of apples to my cart"
- "What drinks do you have?"
- "Remove the bananas"
- "What's in my cart?"

The agent maintains conversation memory and automatically shows the updated cart after each interaction, making it easy for users to track their shopping progress!

---

🛒 **Current Cart:**

Your cart is empty.

```plaintext
mastra-ufsc-server/
├── src/mastra/
│   ├── agents/inventory-agent.ts       # Main agent
│   ├── tools/                         # All cart & inventory tools
│   ├── utils/                         # Cart manager & inventory data
│   └── index.ts                       # Updated configuration
├── test-inventory-agent.ts            # Test script
└── README_INVENTORY_AGENT.md          # Documentation
```

```shellscript
# Test the agent
cd mastra-ufsc-server
pnpm tsx test-inventory-agent.ts

# Or use Mastra dev environment
pnpm mastra dev
```

