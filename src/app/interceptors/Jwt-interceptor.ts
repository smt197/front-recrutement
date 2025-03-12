import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, switchMap, from } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root"
})
export class JwtInterceptor implements HttpInterceptor {
  private readonly apiUrl = environment.apiUrl;
  private csrfInitialized = false; // Indicateur pour éviter les requêtes répétées

  constructor(private authService: AuthService,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.csrfInitialized) {
      return this.fetchCsrfToken().pipe(
        switchMap(() => this.handleRequestWithCsrf(request, next))
      );
    }
    return this.handleRequestWithCsrf(request, next);
  }

  private fetchCsrfToken(): Observable<any> {
    this.csrfInitialized = true;
    return this.authService.getCsrfToken();
  }

  private handleRequestWithCsrf(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const xsrfToken = this.getXSRFToken();
    
    request = request.clone({
      withCredentials: true,
      setHeaders: {
        'Accept-Language': "fr",
        'Accept': 'application/json, multipart/form-data',
        ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {})
      }
    });

    return next.handle(request);
  }

  private getXSRFToken(): string | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'XSRF-TOKEN') {
        return decodeURIComponent(value);
      }
    }
    return null;
  }
}