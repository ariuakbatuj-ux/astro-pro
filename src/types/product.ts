// src/types/product.ts

export interface Product {
  _id: number;
  name: string;
  description?: string;
  price: number;
  category_id: number;
  images?: string[];
  stock_quantity: number;
  rating?: number;
  status: 'active' | 'inactive' | 'draft';
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  _id: number;
  name: string;
  slug: string;
  description?: string;
  status: 'active' | 'inactive';
  created_at?: string;
}

export interface ProductFilter {
  category?: string;
  priceRange?: string;
  search?: string;
  sort?: 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
  minPrice?: number;
  maxPrice?: number;
}
