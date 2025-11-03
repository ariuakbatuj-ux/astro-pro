// src/types/wishlist.ts

export interface WishlistItem {
  _id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  products?: {
    _id: number;
    name: string;
    price: number;
    images?: string[];
    stock_quantity: number;
    rating?: number;
  };
}
