import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000/api' 
};


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
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((usuarios) =>
        (usuarios || []).map((u: any) => {
          const id = String(u?._id ?? u?.id ?? '');
          const perfil_id =
            u?.perfil_id != null && u?.perfil_id !== ''
              ? String(u.perfil_id)
              : Array.isArray(u?.perfiles) && u.perfiles.length > 0
                ? String(u.perfiles[0])
                : undefined;

          return {
            ...u,
            id,
            perfil_id,
          } as Usuario;
        })
      )
    );
  }

  getUsuario(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((data) => {
        const usuario = data?.usuario ?? {};
        const usuarioId = String(usuario?._id ?? usuario?.id ?? '');

        const perfil_id =
          usuario?.perfil_id != null && usuario?.perfil_id !== ''
            ? String(usuario.perfil_id)
            : Array.isArray(usuario?.perfiles) && usuario.perfiles.length > 0
              ? String(usuario.perfiles[0])
              : '';

        const perfilesDocs = Array.isArray(data?.perfiles)
          ? data.perfiles.map((p: any) => ({
              ...p,
              id: String(p?._id ?? p?.id ?? ''),
            }))
          : [];

        return {
          ...data,
          usuario: {
            ...usuario,
            id: usuarioId,
            perfil_id,
          },
          perfiles: perfilesDocs,
        };
      })
    );
  }

  crearUsuario(usuario: FormData): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  actualizarUsuario(id: string, usuario: FormData): Observable<Usuario> {
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
