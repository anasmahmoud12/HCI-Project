// models/Order.ts

import { ProductView } from "./product.model";

// ========== REQUEST MODELS (for placing orders) ==========
export interface OrderDto {
  status?: string; // Optional - backend will set default to PENDING
  totalPriceOfOrder: number;
  items: OrderItemRequest[];
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
  priceOfOne: number; // Current price at time of order
  totalPrice: number;
}

// ========== RESPONSE MODELS (from backend) ==========
export interface OrderResponse {
  id: number;
  orderNumber: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  orderItems: OrderItemResponse[];
  user: UserBasicInfo;
}

export interface OrderItemResponse {
  id: number;
  quantity: number;
  price: number;
  totalPrice: number;
  product: ProductBasicInfo;


}

export interface ProductBasicInfo {
  id: number;
  name: string;
  description: string;
  priceBefore: number;
  priceAfter: number;
  brand:string
}

export interface UserBasicInfo {
  id: number;
  firstName: string;
  email: string;
}