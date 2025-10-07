import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UsuariosService, Usuario } from '../services/UsuariosService';
import { finalize, timeout } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule], // <-- agregar DatePipe aquí
  templateUrl: './usuario-list.component.html',
})
export class UsuarioListComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = false;
  error = false;

  constructor(
    private usuarioService: UsuariosService,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.loading = true;
    this.error = false;

    this.usuarioService
      .getUsuarios()
      .pipe(
        timeout(10000),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (data) => {
          this.usuarios = data || [];
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = true;
          this.usuarios = [];
          this.cdr.detectChanges();
          alert('Error al cargar los usuarios: ' + (err.message || 'Error desconocido'));
        },
      });
  }

  viewUsuario(id: string) {
    this.router.navigate(['/usuarios/view', id]);
  }

  editUsuario(id: string) {
    this.router.navigate(['/usuarios/edit', id]);
  }

  deleteUsuario(id: string) {
    if (confirm('¿Eliminar este usuario?')) {
      this.usuarioService.eliminarUsuario(id).subscribe({
        next: () => this.loadUsuarios(),
        error: () => alert('Error al eliminar el usuario'),
      });
    }
  }

  exportPdf() {
    this.usuarioService.exportPdf().subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'usuarios.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  exportExcel() {
    this.usuarioService.exportExcel().subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'usuarios.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
