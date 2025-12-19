import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home-page/home-page.component';
import { ProductsComponent } from './components/view-products/view-products.component';
import { AdminComponent } from "./components/admin.component";
import { LogInComponent } from "./components/log-in/log-in.component";
import { Orders } from "./components/orders";
import { CartComponent } from "./components/cart/cart.component";
import { WishlistComponent } from "./components/wishlist/wishlist";
import { SignUpComponent } from "./components/sign-up/sign-up.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, HomeComponent, ProductsComponent, AdminComponent, LogInComponent, Orders, CartComponent, WishlistComponent, SignUpComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'e-commerce-frontend';
} 