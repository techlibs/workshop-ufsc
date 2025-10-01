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

