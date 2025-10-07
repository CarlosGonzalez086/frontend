import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductoListComponent } from './producto/producto-list.component';
import { ProductoFormComponent } from './producto/producto-form.component';
import { PerfilListComponent } from './perfiles/perfil-list.component';
import { PerfilFormComponent } from './perfiles/perfil-form.component';
import { ForgotPasswordComponent } from './auth/resetpassword/forgot-password.component';
import { ResetPasswordComponent } from './auth/resetpassword/reset-password.component';
import { UsuarioListComponent } from './usuarios/usuario-list.component';
import { UsuarioFormComponent } from './usuarios/usuario-form.component';
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },

  // Productos
  { path: 'productos', component: ProductoListComponent },
  { path: 'productos/create', component: ProductoFormComponent },
  { path: 'productos/edit/:id', component: ProductoFormComponent },
  { path: 'productos/view/:id', component: ProductoFormComponent },

  // Perfiles
  { path: 'perfiles', component: PerfilListComponent },
  { path: 'perfiles/create', component: PerfilFormComponent },
  { path: 'perfiles/edit/:id', component: PerfilFormComponent },
  { path: 'perfiles/view/:id', component: PerfilFormComponent },

  // Usuarios
  { path: 'usuarios', component: UsuarioListComponent },
  { path: 'usuarios/create', component: UsuarioFormComponent },
  { path: 'usuarios/edit/:id', component: UsuarioFormComponent },
  { path: 'usuarios/view/:id', component: UsuarioFormComponent },

  // Recuperación de contraseña
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },

  { path: '**', redirectTo: 'dashboard' },
];
