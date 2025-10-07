import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  nombre?: string;
  usuario: string;
  password: string;
  rol?: string;
}

export interface AuthResponse {
  codigo: string;
  mensaje: string;
  respuesta?: {
    user_id: number;
    nombre: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  register(user: User): Observable<any> {
    // Mapear los campos al backend
    const payload = {
      name: user.nombre,
      email: user.usuario,
      password: user.password,
      rol: user.rol || 'usuario', // por defecto
    };

    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`);
  }

  logout() {
    localStorage.removeItem('user');
  }
}
