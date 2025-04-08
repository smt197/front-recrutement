import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';
import { map, catchError, of, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
  
    // Vérification synchrone seulement
    const token = authService.getToken();
    const currentUser = authService.userValue;
  
    if (!token) {
      return router.createUrlTree(['/login']);
    }
  
    if (!currentUser) {
      // Si l'utilisateur n'est pas chargé mais le token existe
      return authService.authenticate().pipe(
        map(response => {
          authService.setUserWithoutRedirect(response);
          return true;
        }),
        catchError((error) => {
          console.error('Erreur lors de l\'authentification :', error);
          router.navigate(['/login']);
          return of(false);
        })
      );
    }
  
    return true;
  };