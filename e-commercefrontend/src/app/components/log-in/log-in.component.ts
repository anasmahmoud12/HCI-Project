// src/app/components/log-in/log-in.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../nav-bar/nav-bar.component';
import { LoginRequest, UserService } from '../../services/UserService';
// import { UserService, LoginRequest } from '../../services/user.service'; // Changed import

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  
  loading = false;
  errorMessage = '';

  constructor(
    private userService: UserService, // Changed from authService
    private router: Router
  ) {}

  login() {
    console.log('try to login')
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      alert('Please fill in all fields');
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const credentials: LoginRequest = {
      email: this.email,
      password: this.password
    };

    this.userService.login(credentials).subscribe({ // Changed to userService
      next: (response) => {
        this.loading = false;
        console.log('Login successful!', response);
        console.log('User ID:', response.id);
        console.log('User Name:', response.firstName, response.lastName);
        console.log('Token:', response.jwtToken);
        
        alert(`Welcome ${response.firstName} ${response.lastName}!`);
        
        // Navigate to home
        this.router.navigate(['/home']);
        
        // Clear form
        this.email = '';
        this.password = '';
      },
      error: (error) => {
        this.loading = false;
        console.error('Login error:', error);
        
        if (error.status === 401 || error.status === 409) {
          this.errorMessage = 'Invalid email or password';
          alert('Invalid email or password');
        } else {
          this.errorMessage = 'Login failed. Please try again.';
          alert('Login failed. Please try again.');
        }
      }
    });
  }
}