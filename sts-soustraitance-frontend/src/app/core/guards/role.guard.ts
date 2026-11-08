import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Usage dans les routes :
 * { path: 'users', canActivate: [roleGuard(['ADMINISTRATEUR'])], component: ... }
 */
export function roleGuard(allowedRoles: string[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.hasRole(...allowedRoles)) {
      return true;
    }

    router.navigate(['/accueil']);
    return false;
  };
}
