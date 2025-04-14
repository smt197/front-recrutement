import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/User';
import { ParamsEmailVerify } from '../interfaces/Params-email-verify';
import { ResponseGlobalServer } from '../interfaces/Response-globalServer';
import { credentialsFormLogin } from '../interfaces/Credentials-form-login';
import { Auth } from '../classes/Auth';
import { UserForgotPassword } from '../interfaces/User-forgot-password';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private _user: User | null = null;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  setUserWithoutRedirect(loginResponse: any): void {
    if (!loginResponse?.user?.role) {
      console.error('Role manquant dans la réponse:', loginResponse);
      return;
    }

    localStorage.setItem('access_token', loginResponse.access_token);
    localStorage.setItem('currentUser', JSON.stringify(loginResponse.user));
    this.currentUserSubject.next(loginResponse.user);

    // Pas de redirection ici !
  }

  /**
   * Récupère le cookie CSRF pour Sanctum
   */
  getCsrfToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/csrf-cookie`, {
      withCredentials: true
    });
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token'); // Ou votre méthode de stockage
  }

  clearToken(): void {
    localStorage.removeItem('jwt_token'); // Ou votre méthode de stockage
    // Autres nettoyages si nécessaire
    // this.user = null;
  }

  get userValue(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  // Après un login réussi
  setUser(loginResponse: any): void {
    if (!loginResponse?.user?.role) {
      console.error('Role manquant dans la réponse:', loginResponse);
      return;
    }

    console.log('User set:', loginResponse.user.role); // Debug

    localStorage.setItem('access_token', loginResponse.access_token);
    localStorage.setItem('currentUser', JSON.stringify(loginResponse.user));
    this.currentUserSubject.next(loginResponse.user);

    // Délai minimal pour s'assurer que la navigation est prête
    setTimeout(() => {
      this.redirectBasedOnRole(loginResponse.user.role);
    }, 200);
  }

  // auth.service.ts
  private redirectBasedOnRole(role: string): void {
    // Tous les rôles sont redirigés vers /home
    this.router.navigate(['/home']).then((success) => {
      if (!success) {
        console.error('Failed to navigate to /home');
        this.router.navigate(['/']);
      }
    });
  }

  private getRoleHome(role: string): string {
    const baseUrl: any = window.location.origin;
    const routes: any = {
      RECRUTEUR: '/home',
      CANDIDATE: '/candidate-dashboard',
      ADMIN: '/admin-dashboard'
    };

    return baseUrl + (routes[role.toUpperCase()] || '/');
  }
  clearUser(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  authenticate(): Observable<{ access_token: string; user: any }> {
    return this.http.get<{ access_token: string; user: any }>(
      `${this.apiUrl}/auth/verify-token`,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`
        }
      }
    );
  }

  /**
   * Inscription d'un utilisateur
   * @param userData Données de l'utilisateur {name, email, password, password_confirmation}
   */
  register(userData: User): Observable<ResponseGlobalServer> {
    return this.http.post<ResponseGlobalServer>(
      `${this.apiUrl}/auth/register`,
      userData
    );
  }

  /**
   * Inscription d'un utilisateur
   * @param paramsData Données de l'url de l' utilisateur {id, hash, uuid, expires,signature}
   */
  emailverify(paramsData: ParamsEmailVerify): Observable<ResponseGlobalServer> {
    const params = new HttpParams()
      .set('expires', paramsData.expires)
      .set('signature', paramsData.signature);

    return this.http.get<ResponseGlobalServer>(
      `${this.apiUrl}/email/verify/${paramsData.id}/${paramsData.hash}/${paramsData.uuid}`,
      { params }
    );
  }

  /**
   * Connexion de l'utilisateur
   * @param credentials {email, password}
   */
  login(credentials: credentialsFormLogin): Observable<ResponseGlobalServer> {
    return this.http
      .post<ResponseGlobalServer>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response: any) => {
          console.log('Login response:', response); // Debug
          if (response.requires2FA) {
            // Rediriger vers la vérification 2FA
            localStorage.setItem('temp_token', response.temp_token);
            this.router.navigate(['/2fa']);
            return;
          }
          if (!response.access_token) {
            throw new Error('Token manquant dans la réponse du serveur');
          }
          localStorage.setItem('jwt_token', response.access_token);
          this.setUser(response);
        }),
        catchError((error) => {
          console.error('Erreur lors du login:', error);
          return throwError(() => error);
        })
      );
  }

  toggle2FA(enable: boolean) {
    return this.http.post(`${this.apiUrl}/auth/2fa/${enable ? 'enable' : 'disable'}`, {});
  }

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/logout`, {
      withCredentials: true // Important pour les cookies/sessions
    });
  }
  /**
   * retouver le status de l'utilisateur
   */
  // authenticate(): Observable<ResponseGlobalServer> {
  //   return this.http.get<ResponseGlobalServer>(`${this.apiUrl}/authenticate`);
  // }

  /**
   * retouver le status de l'utilisateur
   */
  forgotPassword(
    email: UserForgotPassword | null
  ): Observable<ResponseGlobalServer> {
    return this.http.post<ResponseGlobalServer>(
      `${this.apiUrl}/forgot-password`,
      email
    );
  }

  get user(): User | null {
    return this._user;
  }

  set user(value: User | null) {
    try {
      if (value !== null) {
        Auth.userEmitter.emit(value);
        Auth.user = value;
      }
      this._user = value;
    } catch (error) {
      console.error('Error setting user:', error);
    }
  }
}
