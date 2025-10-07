import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { finalize, timeout } from 'rxjs';
import { Perfil, PerfilService } from '../services/PerfilService';

@Component({
  selector: 'app-perfil-list',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule],
  templateUrl: './perfil-list.component.html',
})
export class PerfilListComponent implements OnInit {
  perfiles: Perfil[] = [];
  loading = false;
  error = false;

  constructor(
    private perfilService: PerfilService,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPerfiles();
  }

  loadPerfiles() {
    this.loading = true;
    this.error = false;

    this.perfilService
      .getPerfiles()
      .pipe(
        timeout(10000),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (data) => {
          this.perfiles = data || [];
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = true;
          this.perfiles = [];
          this.cdr.detectChanges();
          console.error('Error al cargar perfiles:', err);
        },
      });
  }

  editPerfil(id: string) {
    this.router.navigate(['/perfiles/edit', id]);
  }

  viewPerfil(id: string) {
    this.router.navigate(['/perfiles/view', id]);
  }

  deletePerfil(id: string) {
    if (confirm('¿Eliminar este perfil?')) {
      this.perfilService.deletePerfil(id).subscribe({
        next: () => this.loadPerfiles(),
        error: () => alert('Error al eliminar el perfil'),
      });
    }
  }

  exportPdf() {
    this.perfilService.exportPdf().subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'perfiles.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  exportExcel() {
    this.perfilService.exportExcel().subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'perfiles.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
