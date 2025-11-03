// src/lib/utils/cart.ts

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  maxStock: number;
}

export class CartManager {
  private static STORAGE_KEY = 'cart';

  /**
   * Get all items in the cart
   */
  static getCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const cart = localStorage.getItem(this.STORAGE_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return [];
    }
  }

  /**
   * Add an item to the cart or increment quantity if it exists
   */
  static addItem(item: CartItem): CartItem[] {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(i => i.id === item.id);

    if (existingIndex > -1) {
      // Item exists, increment quantity (respecting max stock)
      const currentQty = cart[existingIndex].quantity;
      const newQty = Math.min(currentQty + item.quantity, item.maxStock);
      cart[existingIndex].quantity = newQty;
    } else {
      // New item, add to cart
      cart.push({
        ...item,
        quantity: Math.min(item.quantity, item.maxStock)
      });
    }

    this.saveCart(cart);
    return cart;
  }

  /**
   * Update the quantity of a specific item
   */
  static updateQuantity(id: number, quantity: number): CartItem[] {
    const cart = this.getCart();
    const index = cart.findIndex(i => i.id === id);
    
    if (index > -1) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        cart.splice(index, 1);
      } else {
        // Update quantity (respecting max stock)
        cart[index].quantity = Math.min(quantity, cart[index].maxStock);
      }
    }

    this.saveCart(cart);
    return cart;
  }

  /**
   * Remove an item from the cart
   */
  static removeItem(id: number): CartItem[] {
    const cart = this.getCart().filter(item => item.id !== id);
    this.saveCart(cart);
    return cart;
  }

  /**
   * Clear all items from the cart
   */
  static clearCart(): void {
    this.saveCart([]);
  }

  /**
   * Get the total price of all items in the cart
   */
  static getTotal(): number {
    return this.getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  /**
   * Get the total number of items in the cart
   */
  static getItemCount(): number {
    return this.getCart().reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Check if a product is in the cart
   */
  static isInCart(productId: number): boolean {
    return this.getCart().some(item => item.id === productId);
  }

  /**
   * Get a specific item from the cart
   */
  static getItem(productId: number): CartItem | undefined {
    return this.getCart().find(item => item.id === productId);
  }

  /**
   * Validate cart against current stock levels
   * Returns items that need to be updated or removed
   */
  static async validateCart(products: { id: number; stock: number }[]): Promise<{
    valid: boolean;
    updates: { id: number; oldQty: number; newQty: number }[];
    removed: number[];
  }> {
    const cart = this.getCart();
    const updates: { id: number; oldQty: number; newQty: number }[] = [];
    const removed: number[] = [];

    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);
      
      if (!product || product.stock === 0) {
        // Product no longer available or out of stock
        removed.push(item.id);
        this.removeItem(item.id);
      } else if (item.quantity > product.stock) {
        // Quantity exceeds available stock
        updates.push({
          id: item.id,
          oldQty: item.quantity,
          newQty: product.stock
        });
        this.updateQuantity(item.id, product.stock);
      }
    });

    return {
      valid: updates.length === 0 && removed.length === 0,
      updates,
      removed
    };
  }

  /**
   * Save cart to localStorage and dispatch update event
   */
  private static saveCart(cart: CartItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
      
      // Dispatch custom event for other components to listen to
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cartUpdated', { 
          detail: { 
            cart,
            count: cart.reduce((sum, item) => sum + item.quantity, 0),
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
          } 
        }));
      }
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(originalPrice: number, salePrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}
