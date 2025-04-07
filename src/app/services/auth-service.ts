import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/User';
import { ParamsEmailVerify } from '../interfaces/Params-email-verify';
import { ResponseGlobalServer } from '../interfaces/Response-globalServer';
import { credentialsFormLogin } from '../interfaces/Credentials-form-login';
import { Auth } from '../classes/Auth';
import { UserForgotPassword } from '../interfaces/User-forgot-password';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private _user: User | null = null;
  private currentUser: any;


  constructor(private http: HttpClient) {}

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

  setUser(userData: any): void {
    this.user = userData;
    if (userData.access_token) {
      localStorage.setItem('jwt_token', userData.access_token);
    }
  }

  authenticate(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/verify-token`, {
        headers: {
            'Authorization': `Bearer ${this.getToken()}`
        }
    });
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
        tap((response) => {
          if (!response.access_token) {
            throw new Error('Token manquant dans la réponse du serveur');
          }
          localStorage.setItem('jwt_token', response.access_token);
        }),
        catchError((error) => {
          console.error('Erreur lors du login:', error);
          return throwError(() => error);
        })
      );
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
