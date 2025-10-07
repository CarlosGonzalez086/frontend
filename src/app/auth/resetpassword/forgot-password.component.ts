import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- IMPORTAR
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule], // <-- Añádelo aquí
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  email: string = '';
  mensaje: string = '';
  error: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  enviarCorreo() {
    this.mensaje = '';
    this.error = '';

    this.http
      .post<any>('http://127.0.0.1:8000/api/auth/forgot-password', { usuario: this.email })
      .subscribe({
        next: (res) => (this.mensaje = res.mensaje),
        error: (err) => (this.error = err.error?.mensaje || 'Error al enviar el correo'),
      });
  }
  irLogin() {
    this.router.navigate(['/login']);
  }
}
