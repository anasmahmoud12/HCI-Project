export interface Category {
  id?: number;
  name: string;
  description: string;
  isactive: boolean;
}
export interface CategoryFormData {
  name: string;
  description: string;
  isactive: boolean;
  image?: File;  // Single image for category (not array like product)
}