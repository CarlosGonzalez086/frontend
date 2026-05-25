import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/AuthService';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  standalone: true, 
  imports: [FormsModule, CommonModule], 
  templateUrl: './register.component.html',
})
export class RegisterComponent {

  nombre = '';
  email = '';
  password = '';
  mensajeError = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    const newUser: User = {
      nombre: this.nombre,
      usuario: this.email,
      password: this.password,
      rol: 'admin', 
      perfiles: ["68edab4e2790951a2e057447"] 
    };

    this.authService.register(newUser).subscribe({
      next: (res) => {
        alert('Registro exitoso! Por favor inicia sesión');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.mensajeError = 'Error al registrarse';
      }
    });
  }
    irLogin() {
    this.router.navigate(['/login']);
  }
}
