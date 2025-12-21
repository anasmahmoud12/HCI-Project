import { ProductView } from './product.model';

export interface WishlistItem {
  id: number;
  userId: number;
  product: ProductView;
  addedAt: Date;
}

export interface WishlistToggleResponse {
  action: 'added' | 'removed';
}