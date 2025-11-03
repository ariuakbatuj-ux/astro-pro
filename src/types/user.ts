// src/types/user.ts

export interface User {
  _id: number;
  username: string;
  email: string;
  password_hash?: string;
  role: 'customer' | 'admin';
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  _id: number;
  user_id: number;
  name?: string;
  phone?: string;
  aimag?: string;
  sum?: string;
  horoo?: string;
  birthday?: string;
  created_at?: string;
  updated_at?: string;
}

export interface JWTPayload {
  userId: number;
  username: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}
