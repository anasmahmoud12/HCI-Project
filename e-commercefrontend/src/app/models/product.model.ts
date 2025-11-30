export interface Product {
  id?: number;
  name: string;
  description: string;
  priceBefore: number;
  priceAfter: number;
  stock_quantity: number;
  categoryId: number;
}

export interface ProductFormData {
  name: string;
  description: string;
  priceBefore: number;
  priceAfter: number;
  stock_quantity: number;
  categoryId: number;
  primaryImageIndex: number;
  images: File[];
}