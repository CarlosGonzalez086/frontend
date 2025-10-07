import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  user: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      // solo en cliente
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        this.router.navigate(['/login']);
        // Refrescar la página
        window.location.reload();
      } else {
        this.user = JSON.parse(storedUser);
      }
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
