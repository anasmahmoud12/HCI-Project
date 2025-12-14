import { Address } from "./Address";
import { OrderItemEntity, OrderItemRequest } from "./OrderItemEntity";
import { User } from "./User";

export interface OrderEntity {
  id: number;
  orderNumber: string;
  totalPrice: number;
  status: string; // 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'
  paymentMethod: string;
  createdAt: string;
  user?: User;
  shippingAddress: Address;
  orderItems: OrderItemEntity[];
}
//for request
export interface OrderDto {
  addressId: number;
  paymentMethod: string;
  items: OrderItemRequest[];
}