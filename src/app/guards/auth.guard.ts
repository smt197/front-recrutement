import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { AuthService } from "../services/auth-service";
import { inject } from "@angular/core";
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    // Vérifie si le token JWT est présent et valide
    if (!authService.getToken()) {
        router.navigate(['/login']);
        return false;
    }

    return authService.authenticate().pipe(
        map(response => {
            // Si l'authentification est réussie
            if (response.access_token) {
                authService.setUser(response); // Stocke les infos utilisateur
                return true;
            }
            
            // Si problème d'authentification
            router.navigate(['/login']);
            return false;
        }),
        catchError(error => {
            console.error('Erreur d\'authentification:', error);
            authService.clearToken();
            router.navigate(['/login']);
            return of(false);
        })
    );
}