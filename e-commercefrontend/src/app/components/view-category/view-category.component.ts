// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { CategoryDto } from '../models/Category';
// import { ServiceCategories } from '../SeriveCategories';

// @Component({
//   selector: 'app-view-category',
//   imports: [CommonModule],
//   templateUrl: './view-category.component.html',
//   styleUrl: './view-category.component.css'
// })
// export class ViewCategoryComponent implements OnInit {
//   catagories: CategoryDto[] = [];

//   constructor(private service: ServiceCategories) {}

//   ngOnInit(): void {
//     this.getAllCategories();
//   }

//   getAllCategories() {
//     this.service.getAllCategories().subscribe({
//       next: (res) => {
//         console.log(res);
//         this.catagories = res;
//       },
//       error: (err) => {
//         console.log("error happened");
//       }
//     });
//   }
// }