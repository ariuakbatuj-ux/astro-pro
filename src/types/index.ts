// src/types/index.ts
// Central export for all types

export * from './product';
export * from './user';
export * from './order';
export * from './wishlist';

// Cart types (client-side only)
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  maxStock: number;
}

// API Response types
export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Address types (for Mongolian address system)
export interface Address {
  aimag: string;
  sum: string;
  horoo?: string;
}
