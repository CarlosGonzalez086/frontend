import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface User {
  id?: number;
  nombre?: string;
  usuario: string;
  password: string;
  rol?: string;
  perfiles?: string[];
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
export type Rol = 'usuario' | 'admin' | string;
interface StoredPerfil {
  codigo: string;
  nombre: string;
  secciones: string[];
  created_at: string;
  updated_at: string;
  id: string;
}
interface StoredUser {
  user_id: string | number;
  name?: string;
  nombre?: string;
  email: string;
  rol?: Rol;
  token?: string;
  perfiles?: StoredPerfil[];
}
interface JwtPayload {
  iat: number;
  exp: number;
  user_id: string | number;
  email: string;
  rol?: Rol;
  perfiles?: StoredPerfil[];
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/auth';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  loginUser(usuario: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/loginUser`, { usuario, password });
  }

  register(user: User): Observable<any> {
    const payload = {
      name: user.nombre,
      email: user.usuario,
      password: user.password,
      rol: user.rol || 'usuario',
      perfiles: user.perfiles || [],
    };
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`);
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('user');
    }
  }

  getStoredUser(key = 'user'): StoredUser | null {
    if (!this.isBrowser()) return null;
    const str = localStorage.getItem(key);
    if (!str) return null;
    try {
      return JSON.parse(str) as StoredUser;
    } catch (e) {
      console.error('JSON inválido en localStorage.user', e);
      return null;
    }
  }

  getRole(key = 'user'): Rol | undefined {
    const user = this.getStoredUser(key);
    if (!user) return undefined;
    if (user.rol) return user.rol;

    if (user.token) {
      try {
        const payload = this.parseJwt<JwtPayload>(user.token);
        return payload.rol;
      } catch (e) {
        console.error('No se pudo decodificar el JWT', e);
      }
    }
    return undefined;
  }

  getToken(key = 'user'): string | undefined {
    const user = this.getStoredUser(key);
    return user?.token;
  }

  getPermittedSections(preferToken = true, key = 'user'): string[] {
    if (!this.isBrowser()) return [];
    const stored = this.getStoredUser(key);
    const uniq = (arr: string[]) => Array.from(new Set(arr));

    if (preferToken && stored?.token) {
      try {
        const payload = this.parseJwt<JwtPayload>(stored.token);
        const sectionsFromToken = payload?.perfiles?.flatMap((p) => p.secciones || []) ?? [];
        return uniq(sectionsFromToken);
      } catch (e) {
        console.error('No se pudo decodificar el JWT para secciones', e);
      }
    }

    const sectionsFromStored = stored?.perfiles?.flatMap((p) => p.secciones || []) ?? [];
    return uniq(sectionsFromStored);
  }

  hasSection(section: string, preferToken = true, key = 'user'): boolean {
    const sections = this.getPermittedSections(preferToken, key);
    return sections.includes(section);
  }

  logoutAll(options?: { clearCaches?: boolean }) {
    if (!this.isBrowser()) return;

    try {
      try {
        sessionStorage.clear();
      } catch {}
      try {
        localStorage.clear();
      } catch {}

      try {
        document.cookie.split(';').forEach((c) => {
          const eqPos = c.indexOf('=');
          const name = (eqPos > -1 ? c.substr(0, eqPos) : c).trim();
          if (name) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          }
        });
      } catch {}

      if (options?.clearCaches && 'caches' in window) {
        caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
      }
    } catch (e) {
      console.error('Error limpiando sesión', e);
    }
  }

  private parseJwt<T = unknown>(token: string): T {
    const base64Url = token.split('.')[1];
    if (!base64Url) throw new Error('Token JWT inválido');
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      (globalThis.atob ?? ((b64: string) => Buffer.from(b64, 'base64').toString('binary')))(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload) as T;
  }
}
