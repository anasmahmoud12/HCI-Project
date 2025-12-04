// components/products.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductModalComponent } from './add-product-modal.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, AddProductModalComponent],
  template: `
    <div class="products-page">
      <div class="page-header">
        <h1>Products</h1>
        <button class="btn-primary" (click)="showAddModal = true">
          + Add Product
        </button>
      </div>
      
      <div class="products-list">
        <p>Products will appear here...</p>
      </div>
      
      <app-add-product-modal 
        *ngIf="showAddModal"
        (productAdded)="onProductAdded()"
        (modalClosed)="showAddModal = false">
      </app-add-product-modal>
    </div>
  `,
  styles: [`
    .products-page {
      padding: 20px;
      max-width: 1200px;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    
    .btn-primary {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }
    
    .btn-primary:hover {
      background: #2563eb;
    }
    
    .products-list {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class Products {
  showAddModal = false;
  
  onProductAdded() {
    console.log('Product added, refresh list');
  }
}