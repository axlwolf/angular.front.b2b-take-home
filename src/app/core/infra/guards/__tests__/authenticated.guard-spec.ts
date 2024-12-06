import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
//import { ROUTE_CONFIG } from '../../../core/infra/config/routes.config';

export const authenticatedGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    router.navigate([ROUTE_CONFIG.app, ROUTE_CONFIG.home]);
    return false;
  }

  return true;
};
