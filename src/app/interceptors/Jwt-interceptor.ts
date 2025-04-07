import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService } from "../services/auth-service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class JwtInterceptor implements HttpInterceptor {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Récupérer le token JWT depuis le stockage local
    const token = this.authService.getToken();
    
    // Cloner la requête et ajouter le header Authorization si le token existe
    let authReq = request.clone({
      setHeaders: {
        'Accept-Language': "fr",
        'Accept': 'application/json, multipart/form-data',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });

    // Gérer la réponse pour vérifier les erreurs 401 (Non autorisé)
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Si erreur 401, déconnecter l'utilisateur et rediriger
          this.authService.clearToken();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}