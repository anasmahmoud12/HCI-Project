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
}