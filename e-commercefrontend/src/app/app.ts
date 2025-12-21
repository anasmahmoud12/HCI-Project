import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home-page/home-page.component';
import { ProductsComponent } from './components/view-products/view-products.component';
// import { AdminComponent } from "./components/admin.component";
// import { LogInComponent } from "./components/log-in/log-in.component";
// import { Orders } from "./components/orders";
import { CartComponent } from "./components/cart/cart.component";
import { LoginComponent } from './components/log-in/log-in.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, HomeComponent, ProductsComponent, LoginComponent, CartComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'e-commerce-frontend';
} 