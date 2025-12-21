export interface Order {
  id: number;
  orderNumber: string;
  totalPrice: number;
  status: string;
  payment: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  shippingAddress: {
    id: number;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  totalPrice: number;
  color: string;
  size: number;
  product: {
    id: number;
    name: string;
    priceAfter: number;
  };
}


