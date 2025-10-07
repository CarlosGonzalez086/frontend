import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  id: string; // <-- agregar este
  codigo?: string;
  nombre: string;
  marca: string;
  precio: number;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private baseUrl = 'http://127.0.0.1:8000/api/productos'; 

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.baseUrl);
  }

  getProducto(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/${id}`);
  }

  createProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.baseUrl, producto);
  }

  updateProducto(id: string, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/${id}`, producto);
  }

  deleteProducto(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  exportPdf(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export/pdf`, { responseType: 'blob' });
  }

  exportExcel(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export/excel`, { responseType: 'blob' });
  }
}
