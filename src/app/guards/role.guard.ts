import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.userValue;
  const expectedRoles: string[] = route.data?.['roles'] || [];

  if (!currentUser || !currentUser.role) {
    return router.createUrlTree(['/login']);
  }

  if (expectedRoles.length === 0 || expectedRoles.includes(currentUser.role)) {
    return true;
  }

  // Si le rôle ne correspond pas, rediriger vers l'espace approprié
  if (currentUser.role === 'CANDIDATE') {
    return router.createUrlTree(['/candidate-dashboard']);
  } else {
    return router.createUrlTree(['/home']);
  }
};
