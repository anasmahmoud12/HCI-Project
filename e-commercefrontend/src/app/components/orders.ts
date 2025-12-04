import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div>
      <h2>Orders</h2>
      <button routerLink="/admin">Back to Dashboard</button>
      <p>Orders page content</p>
    </div>
  `
})
export class Orders {}