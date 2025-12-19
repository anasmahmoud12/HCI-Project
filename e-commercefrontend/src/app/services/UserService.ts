// services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

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

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData).pipe(
      tap((response: any) => {
        // Handle both String and UserDTO responses
        if (typeof response === 'string') {
          console.log('Registration successful:', response);
          // User needs to login manually after registration
        } else if (response && response.jwtToken) {
          // Auto-login after registration
          this.saveUserData(response);
        }
      })
    );
  }

  login(credentials: LoginRequest): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.baseUrl}/login`, credentials).pipe(
      tap((response: UserDTO) => {
        if (response && response.jwtToken) {
          this.saveUserData(response);
        }
      })
    );
  }

  private saveUserData(userData: UserDTO): void {
    // Save all user data in localStorage
    localStorage.setItem('jwt', userData.jwtToken);
    localStorage.setItem('userId', userData.id.toString());
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userFirstName', userData.firstName);
    localStorage.setItem('userLastName', userData.lastName);
    localStorage.setItem('userRole', userData.role);
  }

  // Get user ID easily
  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId) : null;
  }

  // Get user email
  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }

  // Get full name
  getUserFullName(): string {
    const firstName = localStorage.getItem('userFirstName') || '';
    const lastName = localStorage.getItem('userLastName') || '';
    return `${firstName} ${lastName}`.trim();
  }

  // Get all user data as an object
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

  // Get JWT token
  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Logout - remove all user data
  logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
    localStorage.removeItem('userRole');
  }
}