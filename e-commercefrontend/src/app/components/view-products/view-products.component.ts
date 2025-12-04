// import { ProductDto } from './../models/ProductDto';
// import { Service } from './../service';
// import { Component, OnInit } from '@angular/core';
// import { HttpClientModule } from '@angular/common/http';
// import { ServiceProduct } from '../serviceProduct';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-view-products',
//   imports: [FormsModule, CommonModule],
//   templateUrl: './view-products.component.html',
//   styleUrl: './view-products.component.css'
// })
// export class ViewProductsComponent implements OnInit {
//   products: ProductDto[] = [];
  
//   constructor(private service: ServiceProduct) {}

//   ngOnInit(): void {
//     this.getProducts();
//   }

//   getProducts() {
//     console.log('yes');
//     this.service.getProducts().subscribe({
//       next: (res) => {
//         this.products = res;
//         console.log(this.products);
//       },
//       error: (err) => {
//         console.error('Error fetching products:', err);
//       }
//     });
//   }

//   addToCart(product: ProductDto) {
//     console.log('Added to cart:', product);
//     // Implement your add to cart logic here
//   }

//   toggleWishlist(product: ProductDto) {
//     // product.isInWishlist = !product.isInWishlist;
//     console.log('Wishlist toggled:', product);
//     // Implement your wishlist logic here
//   }
// }