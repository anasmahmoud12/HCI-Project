import { ProductView } from "./product.model";

export interface Category {
  id?: number;
  name: string;
  description: string;
  isactive: boolean;
  img?: string; 
  created_At?: string | Date;
  update_At?: string | Date;
  
  products?: any[];
}

export interface CategoryFormData {
  name: string;
  description: string;
  isactive: boolean;
  image?: File;  
  removeImage?: boolean;
}
export interface CategoryView{
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  img?: string;
  imageFile?: File;///you put in above i not need 
  createdAt: string;
  updatedAt: string;
  products: ProductView[];
}