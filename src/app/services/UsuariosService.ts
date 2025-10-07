import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Perfil {
  id: string;
  codigo: string;
  nombre: string;
  secciones?: string[];
  created_at?: string;
}

export interface Usuario {
  id: string;
  codigo?: string;
  nombre: string;
  usuario: string; // email
  telefono?: string;
  fotoPerfil?: string;
  password?: string;
  created_at?: string;
  perfiles?: Perfil[];
}

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private apiUrl = 'http://127.0.0.1:8000/api/usuarios';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl).pipe(
      map((usuarios) =>
        usuarios.map((u) => ({
          ...u,
          id: u.id || u.id,
          perfiles: u.perfiles?.map((p) => ({ ...p, id: p.id || p.id })),
        }))
      )
    );
  }

  getUsuario(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`).pipe(
      map((u) => ({
        ...u,
        perfiles: u.perfiles?.map((p) => ({ ...p, id: p.id || p.id })),
      }))
    );
  }

  crearUsuario(usuario: FormData): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  actualizarUsuario(id: string, usuario: FormData): Observable<Usuario> {
    // Usando POST con _method=PUT
    return this.http.post<Usuario>(`${this.apiUrl}/${id}?_method=PUT`, usuario);
  }

  eliminarUsuario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  exportExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/excel`, { responseType: 'blob' });
  }

  exportPdf(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/pdf`, { responseType: 'blob' });
  }
}
