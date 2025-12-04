import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="admin-container">
      <!-- Sidebar -->
      <nav class="sidebar">
        <div class="logo">
          <h2>🛒 Store Admin</h2>
        </div>
        <div class="nav-links">
          <a routerLink="/admin" routerLinkActive="active" class="nav-link">
            <span>📊</span> Dashboard
          </a>
          <a routerLink="products" routerLinkActive="active" class="nav-link">
            <span>📦</span> Products
          </a>
          <a routerLink="categories" routerLinkActive="active" class="nav-link">
            <span>🏷️</span> Categories
          </a>
          <a routerLink="orders" routerLinkActive="active" class="nav-link">
            <span>📋</span> Orders
          </a>
          <a routerLink="admins" routerLinkActive="active" class="nav-link">
            <span>👤</span> Admins
          </a>
        </div>
        <div class="user-info">
          <div class="user-avatar">AD</div>
          <div class="user-details">
            <strong>Admin User</strong>
            <small>admin@store.com</small>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="main-content">
        <div class="content-container">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-container {
      display: flex;
      min-height: 100vh;
      background: #f5f7fa;
    }

    .sidebar {
      width: 250px;
      background: linear-gradient(180deg, #2c3e50, #1a2530);
      color: white;
      display: flex;
      flex-direction: column;
      padding: 20px 0;
    }

    .logo {
      padding: 0 20px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 20px;
    }

    .logo h2 {
      margin: 0;
      font-size: 18px;
      color: #4dabf7;
    }

    .nav-links {
      flex: 1;
      padding: 0 15px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 15px;
      color: #b0b7c3;
      text-decoration: none;
      border-radius: 8px;
      margin-bottom: 5px;
      transition: all 0.3s;
    }

    .nav-link:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .nav-link.active {
      background: #4dabf7;
      color: white;
      font-weight: 500;
    }

    .nav-link span {
      font-size: 18px;
    }

    .user-info {
      padding: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: #4dabf7;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    .user-details {
      flex: 1;
    }

    .user-details strong {
      display: block;
      font-size: 14px;
    }

    .user-details small {
      color: #b0b7c3;
      font-size: 12px;
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
    }

    .content-container {
      padding: 30px;
    }
  `]
})
export class AdminComponent {}