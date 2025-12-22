// src/app/components/sign-up/sign-up.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../nav-bar/nav-bar.component';
import { RegisterRequest, UserService } from '../../services/UserService';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignupComponent {
  // Form fields
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  
  // UI state
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  /**
   * Handle form submission
   */
  sighUp() {
    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';

    // Validate all fields are filled
    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      alert('❌ Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      alert('❌ Please enter a valid email address');
      return;
    }

    // Validate password length
    if (this.password.length < 4) {
      this.errorMessage = 'Password must be at least 4 characters long';
      alert('❌ Password must be at least 4 characters long');
      return;
    }

    // Validate passwords match
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      alert('❌ Passwords do not match');
      return;
    }

    // Show loading state
    this.loading = true;

    // Prepare registration data
    const userData: RegisterRequest = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password
    };

    console.log('📤 Sending registration request for:', this.email);

    // Call registration service
    this.userService.register(userData).subscribe({
      next: (response: string) => {
        // Success! Backend returned: "User registered successfully!"
        console.log('✅ Registration successful!');
        console.log('Server response:', response);
        
        this.loading = false;
        this.successMessage = response;
        
        // Show success message to user
        alert(`✅ ${response}\n\nYou can now login with your credentials.`);
        
        // Navigate to login page after short delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error) => {
        // Error occurred during registration
        console.error('❌ Registration failed');
        console.error('Error details:', error);
        
        this.loading = false;
        
        // Handle different error scenarios
        if (error.status === 409) {
          // HTTP 409 Conflict - Email already exists
          this.errorMessage = 'Email is already in use!';
          alert('❌ Email is already in use! Please use a different email address.');
        } 
        else if (error.status === 400) {
          // HTTP 400 Bad Request - Invalid data
          this.errorMessage = 'Invalid registration data';
          alert('❌ Invalid registration data. Please check your inputs.');
        } 
        else if (error.status === 0) {
          // HTTP 0 - Network error, backend not reachable
          this.errorMessage = 'Cannot connect to server';
          alert('❌ Cannot connect to server.\n\nPlease make sure:\n1. Backend is running on http://localhost:8080\n2. CORS is enabled on the backend\n3. No firewall is blocking the connection');
        } 
        else if (error.error) {
          // Get error message from response body
          const errorMsg = typeof error.error === 'string' 
            ? error.error 
            : error.error.message || 'Registration failed';
          this.errorMessage = errorMsg;
          alert(`❌ ${errorMsg}`);
        } 
        else {
          // Generic error
          this.errorMessage = 'Registration failed. Please try again.';
          alert('❌ Registration failed. Please try again.');
        }
      }
    });
  }

  /**
   * Reset form fields
   */
  resetForm() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.errorMessage = '';
    this.successMessage = '';
  }
}