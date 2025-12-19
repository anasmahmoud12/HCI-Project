// src/app/components/sign-up/sign-up.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../nav-bar/nav-bar.component';
import { RegisterRequest, UserService } from '../../services/UserService';
// import { UserService, RegisterRequest } from '../../services/user.service'; // Changed import

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignupComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private userService: UserService, // Changed from authService
    private router: Router
  ) {}

  // Method called from template
  sighUp() {
    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';

    // Basic validation
    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      alert('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      alert('Please enter a valid email address');
      return;
    }

    // Password validation
    if (this.password.length < 4) {
      this.errorMessage = 'Password must be at least 4 characters long';
      alert('Password must be at least 4 characters long');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      alert('Passwords do not match');
      return;
    }

    this.loading = true;

    // Prepare user data for backend
    const userData: RegisterRequest = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password
      // Note: Removed the 'name' field as your backend expects firstName/lastName separately
    };

    this.userService.register(userData).subscribe({ // Changed to userService
      next: (response) => {
        this.loading = false;
        
        // Check if response is a string (old backend) or object (new backend)
        if (typeof response === 'string') {
          // Old backend - just string response
          this.successMessage = response;
          alert('✅ ' + response);
        } else if (response && response.jwtToken) {
          // New backend - UserDTO response with JWT
          this.successMessage = 'Registration successful!';
          console.log('Registration successful! User:', response);
          alert(`✅ Registration successful! Welcome ${response.firstName}!`);
          
          // If auto-login after registration, navigate to home
          this.router.navigate(['/home']);
        }
        
        // Redirect after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        console.error('Registration error:', error);
        
        if (error.status === 409) {
          this.errorMessage = 'Email already exists. Please use a different email.';
          alert('❌ Email already exists. Please use a different email.');
        } else if (error.error && typeof error.error === 'string') {
          this.errorMessage = error.error;
          alert(`❌ ${error.error}`);
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
          alert('❌ Registration failed. Please try again.');
        }
      }
    });
  }
}