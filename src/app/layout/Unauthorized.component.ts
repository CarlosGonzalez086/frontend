import { Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  template: `
    <div class="container py-4">
      <h2>Acceso no autorizado</h2>
      <p>No tienes permisos para acceder a esta sección.</p>
    </div>
  `
})
export class UnauthorizedComponent {}