import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CreatePerfil, PerfilService } from '../services/PerfilService';


@Component({
  selector: 'app-perfil-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './perfil-form.component.html',
})
export class PerfilFormComponent implements OnInit {
  form!: FormGroup;
  id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private perfilService: PerfilService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.form = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      secciones: [''],
    });

    if (this.id) {
      this.perfilService.getPerfil(this.id).subscribe({
        next: (data) => {
          this.form.patchValue({
            codigo: data.codigo,
            nombre: data.nombre,
            secciones: data.secciones?.join(', '),
          });
        },
      });
    }
  }

  cancel() {
    this.router.navigate(['/perfiles']);
  }

onSubmit() {
  if (this.form.invalid) return;

  const perfilData: CreatePerfil = {
    codigo: this.form.value.codigo,
    nombre: this.form.value.nombre,
    secciones: this.form.value.secciones
      ? this.form.value.secciones.split(',').map((s: string) => s.trim())
      : [],
  };

  const request = this.id
    ? this.perfilService.updatePerfil(this.id, { ...perfilData, id: this.id })  // Para update
    : this.perfilService.createPerfil(perfilData);                               // Para create

  request.subscribe({
    next: () => {
      alert('Perfil guardado correctamente');
      this.router.navigate(['/perfiles']);
    },
    error: (err) => {
      console.error(err);
      alert('Error al guardar el perfil');
    },
  });
}

}
