// reset-password.component.ts
import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true, 
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule], // <-- Añádelo aquí
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  mensaje: string = '';
  error: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  resetPassword() {
    this.mensaje = '';
    this.error = '';

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.http
      .post<any>('http://127.0.0.1:8000/api/auth/reset-password', {
        token: this.token,
        new_password: this.newPassword,
        new_password_confirmation: this.confirmPassword,
      })
      .subscribe({
        next: (res) => {
          this.mensaje = res.mensaje;
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => (this.error = err.error?.mensaje || 'Error al restablecer la contraseña'),
      });
  }
}
