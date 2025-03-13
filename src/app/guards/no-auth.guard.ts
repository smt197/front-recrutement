import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router"
import { AuthService } from "../services/auth-service";
import { inject } from "@angular/core";
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const noAuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    return authService.authenticate().pipe(
        map(response => {
            // Si l'utilisateur est déjà authentifié, on le redirige vers la page d'accueil
            if (response.status) {
                console.log(response.status);
                
                router.navigate(['index']); // ou toute autre page principale
                return false;
            }
            
            // Si l'utilisateur n'est pas authentifié, on autorise l'accès à la route
            return true;
        }),
        catchError(error => {
            // En cas d'erreur, on suppose que l'utilisateur n'est pas authentifié
            // et on autorise l'accès à la route
            // console.error('Erreur de vérification d\'authentification:', error);
            return of(true);
        })
    );
}