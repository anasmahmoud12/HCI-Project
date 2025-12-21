// services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Address } from '../models/Address'; // Adjust path as needed

// User model matching your interface
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  addresses: Address[];
  createdAt?: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserDTO {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  jwtToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  /**
   * Register a new user
   * Backend returns: "User registered successfully!" (String with status 201)
   */
  register(userData: RegisterRequest): Observable<string> {
    // CRITICAL: Use responseType: 'text' because backend returns a String, not JSON
    console.log('make request')
    return this.http.post(`${this.baseUrl}/register`, userData, {
      responseType: 'text'  // This tells Angular to expect text, not JSON
    }).pipe(
      tap((response: string) => {
        console.log('✅ Registration successful:', response);
      })
    );
  }

  /**
   * Login user
   * Backend returns: UserDTO object with JWT token
   */
  login(credentials: LoginRequest): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.baseUrl}/login`, credentials).pipe(
      tap((response: UserDTO) => {
        if (response && response.jwtToken) {
          this.saveUserData(response);
          console.log('✅ Login successful, user data saved');
        }
      })
    );
  }

  /**
   * Save user data to localStorage after successful login
   */
  private saveUserData(userData: UserDTO): void {
    localStorage.setItem('jwt', userData.jwtToken);
    localStorage.setItem('userId', userData.id.toString());
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userFirstName', userData.firstName);
    localStorage.setItem('userLastName', userData.lastName);
    localStorage.setItem('userRole', userData.role);
  }

  /**
   * Get current user ID from localStorage
   */
  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId) : null;
  }

  /**
   * Get current user email
   */
  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }

  /**
   * Get user's full name
   */
  getUserFullName(): string {
    const firstName = localStorage.getItem('userFirstName') || '';
    const lastName = localStorage.getItem('userLastName') || '';
    return `${firstName} ${lastName}`.trim();
  }

  /**
   * Get all user data from localStorage as UserDTO
   */
  getUserData(): UserDTO | null {
    const token = this.getToken();
    const id = this.getUserId();
    
    if (!token || !id) {
      return null;
    }
    
    return {
      id: id,
      email: this.getUserEmail() || '',
      firstName: localStorage.getItem('userFirstName') || '',
      lastName: localStorage.getItem('userLastName') || '',
      role: localStorage.getItem('userRole') || '',
      jwtToken: token
    };
  }

  /**
   * Get JWT token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  /**
   * Check if user is currently logged in
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Logout user and clear all stored data
   */
  logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
    localStorage.removeItem('userRole');
  }

  /**
   * Get full user profile (if you have an endpoint for this)
   * This would return the complete User object with addresses
   */
  getUserProfile(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${userId}`);
  }

  /**
   * Update user profile
   */
  updateUserProfile(userId: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${userId}`, userData);
  }
}