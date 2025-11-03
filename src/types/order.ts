// src/types/order.ts

export interface Order {
  _id: number;
  user_id: number;
  order_number: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address?: string;
  payment_method?: string;
  created_at: string;
  updated_at?: string;
}

export interface OrderItem {
  _id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
  subtotal: number;
}

export interface OrderWithItems extends Order {
  items: (OrderItem & {
    product?: {
      name: string;
      images?: string[];
    };
  })[];
}
