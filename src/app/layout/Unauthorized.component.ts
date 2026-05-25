import { Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  template: `
    <div class="unauthorized-container">
      <div class="card shadow-sm border-0">

        <h1>403</h1>

        <h2>Acceso no autorizado</h2>

        <p>
          No tienes permisos para acceder a esta sección. Si crees que esto es un error, contacta al
          administrador.
        </p>

        <button class="btn btn-primary mt-3" routerLink="/login">Volver al login</button>
      </div>
    </div>
  `,
  styles: [
    `
      .unauthorized-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f7fb;
        padding: 20px;
      }

      .card {
        max-width: 500px;
        width: 100%;
        border-radius: 20px;
        padding: 40px 30px;
        text-align: center;
        background: white;
      }

      .icon-container {
        width: 90px;
        height: 90px;
        margin: 0 auto 20px;
        border-radius: 50%;
        background: rgba(220, 53, 69, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .icon-container i {
        font-size: 42px;
        color: #dc3545;
      }

      h1 {
        font-size: 72px;
        font-weight: 700;
        margin-bottom: 10px;
        color: #dc3545;
      }

      h2 {
        font-size: 28px;
        font-weight: 600;
        margin-bottom: 15px;
        color: #212529;
      }

      p {
        color: #6c757d;
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 0;
      }

      .btn {
        border-radius: 10px;
        padding: 10px 24px;
        font-weight: 500;
      }
    `,
  ],
})
export class UnauthorizedComponent {}
