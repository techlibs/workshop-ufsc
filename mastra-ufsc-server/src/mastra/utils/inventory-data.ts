export interface Product {
  id: string;
  name: string;
  category: "groceries" | "food" | "drinks" | "fruits";
  price: number;
  unit: string;
  stock: number;
  description: string;
}

export const inventory: Product[] = [
  // Groceries
  {
    id: "groc-001",
    name: "Rice",
    category: "groceries",
    price: 4.99,
    unit: "kg",
    stock: 50,
    description: "Long grain white rice, perfect for everyday meals",
  },
  {
    id: "groc-002",
    name: "Pasta",
    category: "groceries",
    price: 2.49,
    unit: "500g",
    stock: 75,
    description: "Italian durum wheat pasta, various shapes available",
  },
  {
    id: "groc-003",
    name: "Olive Oil",
    category: "groceries",
    price: 12.99,
    unit: "1L",
    stock: 30,
    description: "Extra virgin olive oil, cold pressed",
  },
  {
    id: "groc-004",
    name: "Flour",
    category: "groceries",
    price: 3.49,
    unit: "kg",
    stock: 40,
    description: "All-purpose wheat flour for baking and cooking",
  },
  {
    id: "groc-005",
    name: "Sugar",
    category: "groceries",
    price: 2.99,
    unit: "kg",
    stock: 60,
    description: "Granulated white sugar",
  },

  // Food (Prepared/Ready-to-eat)
  {
    id: "food-001",
    name: "Sandwich",
    category: "food",
    price: 5.99,
    unit: "unit",
    stock: 20,
    description: "Fresh turkey and cheese sandwich with lettuce and tomato",
  },
  {
    id: "food-002",
    name: "Pizza Margherita",
    category: "food",
    price: 8.99,
    unit: "unit",
    stock: 15,
    description: "Classic Italian pizza with tomato, mozzarella, and basil",
  },
  {
    id: "food-003",
    name: "Caesar Salad",
    category: "food",
    price: 6.49,
    unit: "unit",
    stock: 25,
    description:
      "Crisp romaine lettuce with Caesar dressing, croutons, and parmesan",
  },
  {
    id: "food-004",
    name: "Sushi Roll Set",
    category: "food",
    price: 12.99,
    unit: "8 pieces",
    stock: 10,
    description: "California and salmon roll combo",
  },

  // Drinks
  {
    id: "drink-001",
    name: "Orange Juice",
    category: "drinks",
    price: 3.99,
    unit: "1L",
    stock: 40,
    description: "Freshly squeezed orange juice, no sugar added",
  },
  {
    id: "drink-002",
    name: "Mineral Water",
    category: "drinks",
    price: 1.49,
    unit: "1.5L",
    stock: 100,
    description: "Natural spring water",
  },
  {
    id: "drink-003",
    name: "Green Tea",
    category: "drinks",
    price: 4.99,
    unit: "20 bags",
    stock: 35,
    description: "Organic green tea bags",
  },
  {
    id: "drink-004",
    name: "Coffee Beans",
    category: "drinks",
    price: 15.99,
    unit: "kg",
    stock: 25,
    description: "Premium Arabica coffee beans, medium roast",
  },
  {
    id: "drink-005",
    name: "Coca Cola",
    category: "drinks",
    price: 2.49,
    unit: "2L",
    stock: 50,
    description: "Classic Coca Cola soft drink",
  },

  // Fruits
  {
    id: "fruit-001",
    name: "Apples",
    category: "fruits",
    price: 3.99,
    unit: "kg",
    stock: 80,
    description: "Fresh red apples, sweet and crispy",
  },
  {
    id: "fruit-002",
    name: "Bananas",
    category: "fruits",
    price: 2.49,
    unit: "kg",
    stock: 100,
    description: "Ripe yellow bananas, perfect for snacking",
  },
  {
    id: "fruit-003",
    name: "Oranges",
    category: "fruits",
    price: 4.49,
    unit: "kg",
    stock: 60,
    description: "Juicy Valencia oranges",
  },
  {
    id: "fruit-004",
    name: "Strawberries",
    category: "fruits",
    price: 5.99,
    unit: "500g",
    stock: 30,
    description: "Fresh strawberries, sweet and ripe",
  },
  {
    id: "fruit-005",
    name: "Watermelon",
    category: "fruits",
    price: 6.99,
    unit: "unit",
    stock: 20,
    description: "Large seedless watermelon, perfect for summer",
  },
  {
    id: "fruit-006",
    name: "Grapes",
    category: "fruits",
    price: 4.99,
    unit: "kg",
    stock: 40,
    description: "Green seedless grapes",
  },
];

// Helper functions for searching inventory
export function searchInventory(
  query: string,
  category?: Product["category"]
): Product[] {
  const lowerQuery = query.toLowerCase();

  return inventory.filter((product) => {
    const matchesQuery =
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery);
    const matchesCategory = !category || product.category === category;

    return matchesQuery && matchesCategory;
  });
}

export function getProductById(id: string): Product | undefined {
  return inventory.find((product) => product.id === id);
}

export function getProductsByCategory(
  category: Product["category"]
): Product[] {
  return inventory.filter((product) => product.category === category);
}
