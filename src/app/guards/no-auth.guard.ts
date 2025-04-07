import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { AuthService } from "../services/auth-service";
import { inject } from "@angular/core";
import { map, catchError, of } from 'rxjs';

export const noAuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    // Si pas de token, on autorise l'accès
    if (!authService.getToken()) {
        return true;
    }

    return authService.authenticate().pipe(
        map(response => {
            // Si l'utilisateur est déjà authentifié, redirection vers la page d'accueil
            if (response.access_token) {
                authService.setUser(response);
                router.navigate(['/index']);
                return false;
            }
            return true;
        }),
        catchError(error => {
            // En cas d'erreur, on considère que l'utilisateur n'est pas authentifié
            authService.clearToken();
            return of(true);
        })
    );
}