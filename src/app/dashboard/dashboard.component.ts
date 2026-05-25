import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Rol } from '../services/AuthService';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  user: any;
  rol?: Rol;

  private auth = inject(AuthService);

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        this.router.navigate(['/login']);
      } else {
        this.user = JSON.parse(storedUser);

        this.rol = this.auth.getRole();

        if (!this.rol && this.user?.rol) {
          this.rol = this.user.rol as Rol;
        }
      }
    }
  }

  logout() {
    const role = this.rol ?? this.auth.getRole();
    const target = role === 'usuario' ? '/loginUser' : '/login';

    this.auth.logoutAll();

    window.location.replace(target);


  }
}
