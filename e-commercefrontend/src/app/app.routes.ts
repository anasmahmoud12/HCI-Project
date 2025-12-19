// import { Routes } from '@angular/router';

// export const routes: Routes = [
//   {
//     path: 'admin',
//     loadComponent: () => import('./components/admin.component').then(m => m.AdminComponent),
//     children: [
//       { path: '', loadComponent: () => import('./components/dashboard').then(m => m.Dashboard) },
//       { path: 'products', loadComponent: () => import('./components/products').then(m => m.Products) },
//       { path: 'categories', loadComponent: () => import('./components/categories').then(m => m.Categories) },
//       { path: 'orders', loadComponent: () => import('./components/orders').then(m => m.Orders) },
//       { path: 'admins', loadComponent: () => import('./components/admins').then(m => m.Admins) },
//     ]
//   },
//   { path: '', redirectTo: 'admin', pathMatch: 'full' }
// ];


import { Routes } from '@angular/router';
import { LoginComponent } from './components/log-in/log-in.component';
import { SignupComponent } from './components/sign-up/sign-up.component';
import { HomeComponent } from './components/home-page/home-page.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductsComponent } from './components/view-products/view-products.component';
import { OrderHistoryComponent } from './components/orders-component/orders-component';
// import { OrdersComponent } from './components/orders-component/orders-component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {path:'cart',component:CartComponent},
  // {path:'orders',component:}
  {path:'product',component:ProductsComponent},
  {path:'orders',component:OrderHistoryComponent}
];