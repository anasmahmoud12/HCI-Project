export interface Category {
  id?: number;
  name: string;
  description: string;
  isactive: boolean;
  img?: string; 
  created_At?: string | Date;
  update_At?: string | Date;
  
  products?: any[];
  productCount?: number;
}

export interface CategoryFormData {
  name: string;
  description: string;
  isactive: boolean;
  image?: File;  
  removeImage?: boolean;
}
export interface CategoryResponse {
  id: number;
  name: string;
  description: string;
  isactive: boolean;
  img: string;
  created_At: string;
  update_At: string;
    imageFile: any;

  products: any[];
  productCount: number;
}