import { ProductView } from "./product.model";

export interface OrderItemEntity {
  id: number;
  quantity: number;
  price: number;
  color?: string;
  size?: number;
  totalPrice: number;
  product: ProductView;
}
export interface OrderItemRequest {
  productId: number;
  quantity: number;
  priceOfOne: number;
  color?: string;
  size?: number;
}