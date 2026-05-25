import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductoService } from '../services/ProductoService';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './producto-form.component.html',
})
export class ProductoFormComponent implements OnInit {
  form!: FormGroup;
  id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private route: ActivatedRoute,
    public router: Router 
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      marca: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(1)]],
    });

    if (this.id) {
      this.productoService.getProducto(this.id).subscribe({
        next: (data) => this.form.patchValue(data),
      });
    }
  }

  cancel() {
    this.router.navigate(['/productos']);
  }

  onSubmit() {
    if (this.form.invalid) return;

    const producto = this.form.value;

    const request = this.id
      ? this.productoService.updateProducto(this.id, producto)
      : this.productoService.createProducto(producto);

    request.subscribe({
      next: () => {
        alert('Producto guardado correctamente');
        this.router.navigate(['/productos']);
      },
      error: (err) => {
        console.error(err);
        alert('Error al guardar el producto');
      },
    });
  }
}
