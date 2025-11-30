import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-product.component.html',
  styleUrl:'./add-product.component.css'
})
export class AddProductComponent implements OnInit {
  form: FormGroup;
  categories: any[] = [];
  isLoading = false;
  selectedFiles: File[] = [];
  primaryImageIndex: number = 0;
  imagePreviews: string[] = [];

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required]],
      priceBefore: ['', [Validators.required, Validators.min(0)]],
      priceAfter: ['', [Validators.required, Validators.min(0)]],
      stock_quantity: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.selectedFiles.push(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number) {
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
    if (this.primaryImageIndex >= this.selectedFiles.length) {
      this.primaryImageIndex = Math.max(0, this.selectedFiles.length - 1);
    }
  }

  setPrimaryImage(index: number) {
    this.primaryImageIndex = index;
  }

  submit() {
    if (this.form.valid) {
      this.isLoading = true;

      const productData = {
        ...this.form.value,
        images: this.selectedFiles,
        primaryImageIndex: this.primaryImageIndex
      };

      this.productService.createProductWithImages(productData).subscribe({
        next: (response) => {
          this.isLoading = false;
          alert("Product saved successfully!");
          this.resetForm();
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error saving product:', error);
          alert("Error saving product: " + error.message);
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  resetForm() {
    this.form.reset();
    this.selectedFiles = [];
    this.imagePreviews = [];
    this.primaryImageIndex = 0;
  }
}