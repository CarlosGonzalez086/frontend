import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/AuthService';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true, // ⚡
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './loginUser.component.html',
})
export class LoginUserComponent {
  email = '';
  password = '';
  mensajeError = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.loginUser(this.email, this.password).subscribe({
      next: (res) => {
        if (res.codigo === '200' && res.respuesta) {
          localStorage.setItem('user', JSON.stringify(res.respuesta));

          setTimeout(() => {
            this.router.navigate(['/dashboard']).then(() => {
              window.location.reload();
            });
          }, 3000);
        } else {
          this.mensajeError = res.mensaje || 'Error desconocido';
        }
      },
      error: (err) => {
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
