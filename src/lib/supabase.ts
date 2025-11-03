import { createClient } from '@supabase/supabase-js';

// Use import.meta.env for Astro environment variables
const supabaseUrl = import.meta.env.APP_DATABASE_URL || '';
const supabaseAnonKey = import.meta.env.APP_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript
export interface User {
  _id: number;
  username: string;
  email: string;
  password: string;
  role: 'customer' | 'admin' | 'product_manager';
  login_attempts: number;
  ip_addresses: string[];
  account_status: 'active' | 'verified';
  created_at: string;
}

export interface Profile {
  _id: number;
  user_id: number;
  name: string;
  phone?: string;
  birthday?: string;
  avatar?: string;
  aimag?: string;
  sum?: string;
  horoo?: string;
  language: string;
  currency: string;
  notifications: boolean;
  completion_tracking: number;
  updated_at: string;
}

export interface Category {
  _id: number;
  name: string;
  description?: string;
  status: boolean;
  created_by?: number;
  created_at: string;
}

export interface Product {
  _id: number;
  name: string;
  description?: string;
  price: number;
  category_id?: number;
  images?: any; // JSONB
  variants?: any; // JSONB
  stock_quantity: number;
  availability: boolean;
  created_by?: number;
  created_at: string;
}

export interface Order {
  _id: number;
  user_id: number;
  subtotal: number;
  discounts: number;
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  estimated_delivery?: string;
  created_at: string;
  products: any; // JSONB array
}

export interface PromoCode {
  _id: number;
  code: string;
  discount_value: number;
  usage_limit: number;
  used_count: number;
  category_restrictions?: number[];
  expiration_date: string;
  created_at: string;
}