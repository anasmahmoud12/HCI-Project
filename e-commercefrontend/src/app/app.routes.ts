import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./components/admin.component').then(m => m.AdminComponent),
    children: [
      { path: '', loadComponent: () => import('./components/dashboard').then(m => m.Dashboard) },
      { path: 'products', loadComponent: () => import('./components/products').then(m => m.Products) },
      { path: 'categories', loadComponent: () => import('./components/categories').then(m => m.Categories) },
      { path: 'orders', loadComponent: () => import('./components/orders').then(m => m.Orders) },
      { path: 'admins', loadComponent: () => import('./components/admins').then(m => m.Admins) },
    ]
  },
  { path: '', redirectTo: 'admin', pathMatch: 'full' }
];