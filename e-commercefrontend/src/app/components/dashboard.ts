// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [],
//   template: `
//     <div class="dashboard">
//       <div class="header">
//         <h1>Dashboard Overview</h1>
//         <p>Welcome back! Here's what's happening with your store today.</p>
//       </div>

//       <div class="stats-grid">
//         <div class="stat-card">
//           <div class="stat-icon" style="background: #e3f2fd;">📦</div>
//           <div class="stat-content">
//             <h3>154</h3>
//             <p>Total Products</p>
//           </div>
//         </div>

//         <div class="stat-card">
//           <div class="stat-icon" style="background: #e8f5e9;">💰</div>
//           <div class="stat-content">
//             <h3>$12,450</h3>
//             <p>Today's Revenue</p>
//           </div>
//         </div>

//         <div class="stat-card">
//           <div class="stat-icon" style="background: #fff3e0;">📋</div>
//           <div class="stat-content">
//             <h3>24</h3>
//             <p>New Orders</p>
//           </div>
//         </div>

//         <div class="stat-card">
//           <div class="stat-icon" style="background: #f3e5f5;">👥</div>
//           <div class="stat-content">
//             <h3>1,284</h3>
//             <p>Total Customers</p>
//           </div>
//         </div>
//       </div>

//       <div class="content-section">
//         <h2>Recent Activity</h2>
//         <div class="activity-list">
//           <div class="activity-item">
//             <div class="activity-icon">🛒</div>
//             <div class="activity-details">
//               <p><strong>New order #ORD-7842</strong> placed by John Doe</p>
//               <small>10 minutes ago</small>
//             </div>
//             <span class="activity-status success">$245</span>
//           </div>
//           <div class="activity-item">
//             <div class="activity-icon">📦</div>
//             <div class="activity-details">
//               <p><strong>Product "Wireless Headphones"</strong> stock updated</p>
//               <small>30 minutes ago</small>
//             </div>
//             <span class="activity-status info">Stock: 45</span>
//           </div>
//           <div class="activity-item">
//             <div class="activity-icon">👤</div>
//             <div class="activity-details">
//               <p><strong>New customer registration</strong></p>
//               <small>2 hours ago</small>
//             </div>
//             <span class="activity-status">Active</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   `,
//   styles: [`
//     .dashboard {
//       max-width: 1200px;
//     }

//     .header {
//       margin-bottom: 30px;
//     }

//     .header h1 {
//       margin: 0 0 10px 0;
//       color: #2c3e50;
//     }

//     .header p {
//       color: #7f8c8d;
//       margin: 0;
//     }

//     .stats-grid {
//       display: grid;
//       grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//       gap: 20px;
//       margin-bottom: 40px;
//     }

//     .stat-card {
//       background: white;
//       border-radius: 12px;
//       padding: 20px;
//       display: flex;
//       align-items: center;
//       gap: 15px;
//       box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//       transition: transform 0.3s;
//     }

//     .stat-card:hover {
//       transform: translateY(-5px);
//     }

//     .stat-icon {
//       width: 50px;
//       height: 50px;
//       border-radius: 10px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 24px;
//     }

//     .stat-content h3 {
//       margin: 0;
//       font-size: 24px;
//       color: #2c3e50;
//     }

//     .stat-content p {
//       margin: 5px 0 0 0;
//       color: #7f8c8d;
//       font-size: 14px;
//     }

//     .content-section {
//       background: white;
//       border-radius: 12px;
//       padding: 25px;
//       box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//     }

//     .content-section h2 {
//       margin: 0 0 20px 0;
//       color: #2c3e50;
//     }

//     .activity-list {
//       display: flex;
//       flex-direction: column;
//       gap: 15px;
//     }

//     .activity-item {
//       display: flex;
//       align-items: center;
//       gap: 15px;
//       padding: 15px;
//       background: #f8f9fa;
//       border-radius: 8px;
//     }

//     .activity-icon {
//       font-size: 20px;
//     }

//     .activity-details {
//       flex: 1;
//     }

//     .activity-details p {
//       margin: 0 0 5px 0;
//     }

//     .activity-details small {
//       color: #7f8c8d;
//     }

//     .activity-status {
//       padding: 4px 12px;
//       border-radius: 15px;
//       font-size: 12px;
//       font-weight: 500;
//     }

//     .activity-status.success {
//       background: #d4edda;
//       color: #155724;
//     }

//     .activity-status.info {
//       background: #d1ecf1;
//       color: #0c5460;
//     }
//   `]
// })
// export class Dashboard {}