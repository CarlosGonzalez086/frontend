import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { Producto, ProductoService } from '../services/ProductoService';
import { finalize, timeout } from 'rxjs';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, DecimalPipe, DatePipe, RouterModule],
  templateUrl: './producto-list.component.html',
})
export class ProductoListComponent implements OnInit {
  productos: Producto[] = [];
  loading = false;
  error = false;

  constructor(
    private productoService: ProductoService,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProductos();
  }

loadProductos() {
  this.loading = true;
  this.error = false;

  this.productoService
    .getProductos()
    .pipe(
      timeout(10000), 
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
        console.log('finalize ejecutado, loading:', this.loading, 'productos:', this.productos);
      })
    )
    .subscribe({
      next: (data) => {
        this.productos = data || [];
        this.cdr.detectChanges();
        console.log('Datos recibidos:', data);
      },
      error: (err) => {
        this.error = true;
        this.productos = [];
        this.cdr.detectChanges();
        console.error('Error al cargar productos:', err);
        alert('Error al cargar los productos: ' + (err.message || 'Error desconocido'));
      },
      complete: () => {
        console.log('Observable completado');
      },
    });
}

  editProducto(id: string) {
    this.router.navigate(['/productos/edit', id]);
  }

  viewProducto(id: string) {
    this.router.navigate(['/productos/view', id]);
  }

  deleteProducto(id: string) {
    if (confirm('¿Eliminar este producto?')) {
      this.productoService.deleteProducto(id).subscribe({
        next: () => this.loadProductos(),
        error: () => alert('Error al eliminar el producto'),
      });
    }
  }

  exportPdf() {
    this.productoService.exportPdf().subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'productos.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  exportExcel() {
    this.productoService.exportExcel().subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'productos.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}