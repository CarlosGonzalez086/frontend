import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/AuthService';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true, // ⚡
  imports: [CommonModule, FormsModule, RouterModule], // <-- Añádelo aquí
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  mensajeError = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        if (res.codigo === '200' && res.respuesta) {
          // Guardar usuario y token en localStorage
          localStorage.setItem('user', JSON.stringify(res.respuesta));

          // Redirigir al Dashboard
          this.router.navigate(['/dashboard']);
        } else {
          // Mostrar mensaje de error desde la respuesta del backend
          this.mensajeError = res.mensaje || 'Error desconocido';
        }
      },
      error: (err) => {
        // Mostrar mensaje de error HTTP
        this.mensajeError = err.error?.mensaje || 'Usuario o contraseña incorrectos';
      },
    });
  }

  irRegistro() {
    this.router.navigate(['/register']);
  }
  
  irRecuperarContrasena() {
    this.router.navigate(['/forgot-password']);
  }
}
