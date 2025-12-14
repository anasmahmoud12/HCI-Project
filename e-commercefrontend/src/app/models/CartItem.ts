import { ProductView } from "./product.model";

export interface CartItem {
  product: ProductView;
  quantity: number;
  color?: string;
  size?: number;
}
