import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Para listar y editar perfiles (id obligatorio)
export interface Perfil {
  id: string;
  codigo: string;
  nombre: string;
  secciones?: string[];
  created_at?: string;
}

// Para crear un perfil nuevo (sin id aún)
export interface CreatePerfil {
  codigo: string;
  nombre: string;
  secciones?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private apiUrl = 'http://127.0.0.1:8000/api/perfiles';

  constructor(private http: HttpClient) {}

  getPerfiles(): Observable<Perfil[]> {
    return this.http.get<Perfil[]>(this.apiUrl);
  }

  getPerfilesSelect(): Observable<Perfil[]> {
    return this.http.get<Perfil[]>(this.apiUrl);
  }

  getPerfil(id: string): Observable<Perfil> {
    return this.http.get<Perfil>(`${this.apiUrl}/${id}`);
  }

  // Crear perfil usa CreatePerfil
  createPerfil(perfil: CreatePerfil): Observable<Perfil> {
    return this.http.post<Perfil>(this.apiUrl, perfil);
  }

  // Actualizar perfil usa Perfil completo
  updatePerfil(id: string, perfil: Perfil): Observable<Perfil> {
    return this.http.put<Perfil>(`${this.apiUrl}/${id}`, perfil);
  }

  deletePerfil(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  exportPdf(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/pdf`, { responseType: 'blob' });
  }

  exportExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/excel`, { responseType: 'blob' });
  }
}
