import { Routes } from '@angular/router';

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
import { LoginUserComponent } from './auth/loginUser/loginUser.component';
import { LoginComponent } from './auth/login/login.component';
import { SectionGuard } from './services/SectionGuard';
import { UnauthorizedComponent } from './layout/Unauthorized.component';
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'loginUser', component: LoginUserComponent },
  { path: 'register', component: RegisterComponent },
  // Dashboard
  { path: 'dashboard', component: DashboardComponent, canActivate: [SectionGuard], data: { section: 'Dashboard' } },

  // Productos
  { path: 'productos', component: ProductoListComponent, canActivate: [SectionGuard], data: { section: 'Productos' } },
  { path: 'productos/create', component: ProductoFormComponent, canActivate: [SectionGuard], data: { section: 'Productos' } },
  { path: 'productos/edit/:id', component: ProductoFormComponent, canActivate: [SectionGuard], data: { section: 'Productos' } },
  { path: 'productos/view/:id', component: ProductoFormComponent, canActivate: [SectionGuard], data: { section: 'Productos' } },

  // Perfiles
  { path: 'perfiles', component: PerfilListComponent, canActivate: [SectionGuard], data: { section: 'Perfiles' } },
  { path: 'perfiles/create', component: PerfilFormComponent, canActivate: [SectionGuard], data: { section: 'Perfiles' } },
  { path: 'perfiles/edit/:id', component: PerfilFormComponent, canActivate: [SectionGuard], data: { section: 'Perfiles' } },
  { path: 'perfiles/view/:id', component: PerfilFormComponent, canActivate: [SectionGuard], data: { section: 'Perfiles' } },

  // Usuarios
  { path: 'usuarios', component: UsuarioListComponent, canActivate: [SectionGuard], data: { section: 'Usuarios' } },
  { path: 'usuarios/create', component: UsuarioFormComponent, canActivate: [SectionGuard], data: { section: 'Usuarios' } },
  { path: 'usuarios/edit/:id', component: UsuarioFormComponent, canActivate: [SectionGuard], data: { section: 'Usuarios' } },
  { path: 'usuarios/view/:id', component: UsuarioFormComponent, canActivate: [SectionGuard], data: { section: 'Usuarios' } },

  // Acceso no autorizado
  { path: 'unauthorized', component: UnauthorizedComponent },

  // Recuperación de contraseña
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },

  { path: '**', redirectTo: 'dashboard' },
];
