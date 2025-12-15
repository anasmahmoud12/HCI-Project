import { CartItem } from "./CartItem";


export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  total: number;
}
