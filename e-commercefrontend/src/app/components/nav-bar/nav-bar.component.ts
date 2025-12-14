import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports:[FormsModule,CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavbarComponent {
  @Input() isTransparent: boolean = false;
  @Input() username!: string ;
  
  searchQuery: string = '';

  onSearch() {
    console.log('Search query:', this.searchQuery);
    // Add your search logic here
  }
}