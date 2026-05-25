import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { UsuariosService } from '../services/UsuariosService';
import { Perfil, PerfilService } from '../services/PerfilService';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css'],
})
export class UsuarioFormComponent implements OnInit {
  form!: FormGroup;
  id: string | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  perfiles: Perfil[] = [];
  selectedPerfil: string | null = null;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuariosService,
    private perfilService: PerfilService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      usuario: ['', [Validators.required, Validators.email]],
      password: ['', this.id ? [] : [Validators.required, Validators.minLength(6)]],
      telefono: [''],
      fotoPerfil: ['', Validators.required],
      perfil: ['', Validators.required],
    });

    if (this.id) {
      this.usuarioService.getUsuario(this.id).subscribe({
        next: (data) => {
          const userData = data.usuario;
          console.log(userData.perfilesIds[0]);

          this.form.patchValue({
            nombre: userData.nombre || '',
            usuario: userData.usuario || '',
            telefono: userData.telefono || '',
            fotoPerfil: userData.fotoPerfil || '',
          });

          this.previewUrl = userData.fotoPerfil
            ? `http://127.0.0.1:8000/storage/fotos_perfil/${userData.fotoPerfil}`
            : 'assets/default-profile.png';

          const perfilId = userData.perfilesIds[0];

          this.ensurePerfilSelected(perfilId);
        },
        error: (err) => {
          console.error('Error loading usuario:', err);
        },
      });
    }

    this.perfilService.getPerfiles().subscribe({
      next: (perfiles: any[]) => {
        this.perfiles = (perfiles || []).map((p: any) => ({
          ...p,
          id: String(p?.id ?? p?._id ?? ''),
        })) as Perfil[];

        const current = this.form.get('perfil')?.value;
        if (current) this.form.get('perfil')?.setValue(String(current));

        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading perfiles:', err);
      },
    });
  }

  private ensurePerfilSelected(perfilId: any) {
    const idStr = perfilId ? String(perfilId) : '';
    this.selectedPerfil = idStr || null;
    this.form.get('perfil')?.setValue(idStr);
    this.cdr.markForCheck();
  }

  cancel() {
    this.router.navigate(['/usuarios']);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        input.value = '';
        this.selectedFile = null;
        this.previewUrl = null;
        this.form.get('fotoPerfil')?.setErrors({
          invalidType: true,
        });
        alert('Solo se permiten imágenes JPG, JPEG, PNG, GIF y WEBP');
        return;
      }
      this.selectedFile = file;
      this.form.patchValue({
        fotoPerfil: file,
      });
      this.form.get('fotoPerfil')?.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.form.get('nombre')?.value || '');
    formData.append('usuario', this.form.get('usuario')?.value || '');
    formData.append('telefono', this.form.get('telefono')?.value || '');
    formData.append('rol', 'usuario');

    if (this.form.get('password')?.value) {
      formData.append('password', this.form.get('password')?.value);
    }

    if (this.selectedFile) {
      formData.append('fotoPerfil', this.selectedFile);
    }

    const perfilId: string = this.form.get('perfil')?.value;
    if (perfilId) {
      formData.append('perfil_id', perfilId);
    }

    const request = this.id
      ? this.usuarioService.actualizarUsuario(this.id, formData)
      : this.usuarioService.crearUsuario(formData);

    request.subscribe({
      next: () => {
        alert('Usuario guardado correctamente');
        this.router.navigate(['/usuarios']);
      },
      error: (err) => {
        console.error('Error saving usuario:', err);
        alert('Error al guardar el usuario: ' + (err.error?.mensaje || 'Unknown error'));
      },
    });
  }
}
