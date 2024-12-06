import { Routes } from '@angular/router';
import { ROUTE_CONFIG } from './core/infra/config/routes.config';
import { HistorialComponent } from './features/historial/infra/components/historial.component';
import { HomeComponent } from './features/home/infra/home.component';
import { LayoutComponent } from './features/layout/layout.component';
import { LoginComponent } from './features/login/infra/components/login/login.component';
import { provideLogin } from './features/login/infra/config/providers';
import { authGuard } from './core/infra/guards/auth.guard';
import { authenticatedGuard } from './core/infra/guards/authenticated.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ROUTE_CONFIG.login,
  },
  {
    path: ROUTE_CONFIG.login,
    component: LoginComponent,
    providers: [provideLogin()],
    canActivate: [authenticatedGuard],
  },
  {
    path: ROUTE_CONFIG.app,
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: ROUTE_CONFIG.home,
      },
      {
        path: ROUTE_CONFIG.home,
        component: HomeComponent,
      },
      {
        path: ROUTE_CONFIG.historial,
        component: HistorialComponent,
      },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ROUTE_CONFIG.login,
  },
];
