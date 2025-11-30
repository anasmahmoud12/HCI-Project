import { Routes } from '@angular/router';
import { AddCategoryComponent } from './components/add-category/add-category.component';
import {AddProductComponent} from './components/add-product/add-product.component'
export const routes: Routes = [
  { path: '', redirectTo: 'add-category', pathMatch: 'full' },
  { path: 'add-category', component: AddCategoryComponent },
  { path: 'add-product', component: AddProductComponent }
];
