import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // Add ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UsuariosService } from '../services/UsuariosService';
import { Perfil, PerfilService } from '../services/PerfilService';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css'],
})
export class UsuarioFormComponent implements OnInit {
  form!: FormGroup;
  id: string | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  perfiles: Perfil[] = [];
  selectedPerfiles: string[] = [];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuariosService,
    private perfilService: PerfilService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef // Add ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    // Initialize form
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      usuario: ['', [Validators.required, Validators.email]],
      password: ['', this.id ? [] : [Validators.required, Validators.minLength(6)]],
      telefono: [''],
      fotoPerfil: ['', Validators.required],
    });

    // Load profiles from backend
    this.perfilService.getPerfiles().subscribe({
      next: (perfiles) => {
        // Use setTimeout to defer the update to the next change detection cycle
        setTimeout(() => {
          this.perfiles = perfiles;
          this.cdr.detectChanges(); // Manually trigger change detection
        }, 0);
      },
      error: (err) => {
        console.error('Error loading perfiles:', err);
      },
    });

    // If editing a user
    if (this.id) {
      this.usuarioService.getUsuario(this.id).subscribe({
        next: (data) => {
          console.log('User data:', data); // Debug the data structure
          this.form.patchValue({
            nombre: data.nombre || '',
            usuario: data.usuario || '',
            telefono: data.telefono || '',
            fotoPerfil: data.fotoPerfil || '',
          });

          // Profile picture
          if (data.fotoPerfil) {
            this.previewUrl = data.fotoPerfil;
          }

          // Selected profiles
          if (data.perfiles && Array.isArray(data.perfiles)) {
            this.selectedPerfiles = data.perfiles.map((p: any) => p._id); // Adjust based on your data
            this.cdr.detectChanges(); // Trigger change detection
          }
        },
        error: (err) => {
          console.error('Error loading usuario:', err);
        },
      });
    }
  }

  cancel() {
    this.router.navigate(['/usuarios']);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;
      this.form.patchValue({ fotoPerfil: file });
      this.form.get('fotoPerfil')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        this.cdr.detectChanges(); // Trigger change detection after updating previewUrl
      };
      reader.readAsDataURL(file);
    }
  }

  onPerfilesChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const options = Array.from(select.selectedOptions, (option) => option.value);
    this.selectedPerfiles = options;
    this.cdr.detectChanges(); // Trigger change detection after updating selectedPerfiles
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

    // Solo enviar contraseña si existe
    if (this.form.get('password')?.value) {
      formData.append('password', this.form.get('password')?.value);
    }

    // Foto de perfil
    if (this.selectedFile) {
      formData.append('fotoPerfil', this.selectedFile);
    }

    // Perfiles
    this.selectedPerfiles.forEach((id) => formData.append('perfiles[]', id));

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
