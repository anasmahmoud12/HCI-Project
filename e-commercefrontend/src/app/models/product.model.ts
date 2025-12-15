// export interface Product {
//   id?: number;
//   name: string;
//   description: string;
//   priceBefore: number;
//   priceAfter: number;
//   stock_quantity: number;
//   categoryId: number;
// }

import { ProductImage } from "./ProductImage";

// export interface ProductFormData {
//   name: string;
//   description: string;
//   priceBefore: number;
//   priceAfter: number;
//   stock_quantity: number;
//   categoryId: number;
//   primaryImageIndex: number;
//   images: File[];
// }
export interface Product {
  id?: number;
  name: string;
  description: string;
  priceBefore: number;
  priceAfter: number;
  stock_quantity: number;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
  productImages?: Array<{
    id: number;
    img: string; // base64 string
    is_primary: boolean;
    display_order:number;
    productid?: number;
    
  }>;
  created_At?: string | Date;
  update_At?: string | Date;
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
  removedImageIds?: number[]; // For edit: track images to remove
}


export interface ProductView{
    id: number;
  name: string;
  description: string;

  createdAt: string;  
  updatedAt: string;

  priceBefore: number;
  priceAfter: number;
  stock_quantity: number;

  categoryId: number;
  productImages: ProductImage[];
}