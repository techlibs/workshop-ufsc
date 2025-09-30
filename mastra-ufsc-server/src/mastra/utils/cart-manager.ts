import { Product, getProductById } from "./inventory-data";

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
        return total + product.price * item.quantity;
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
      throw new Error(
        `Insufficient stock for ${product.name}. Available: ${product.stock}`
      );
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

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
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

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
    const itemsWithProducts = cart.items.map((item) => ({
      ...item,
      product: getProductById(item.productId),
    }));

    return {
      ...cart,
      items: itemsWithProducts,
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
