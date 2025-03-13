import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router"
import { AuthService } from "../services/auth-service";
import { inject } from "@angular/core";
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    return authService.authenticate().pipe(
        map(response => {
            // Si l'utilisateur est authentifié
            if (response.status) {
                console.log("AG",response.message);
                return true;
            }
            
            // Si l'utilisateur n'est pas authentifié
            router.navigate(['/login']);
            return false;
        }),
        catchError(error => {
            // En cas d'erreur (comme une erreur HTTP 401), rediriger vers login
            console.error('Erreur d\'authentification:', error);
            router.navigate(['/login']);
            return of(false);
        })
    );
}