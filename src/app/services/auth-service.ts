import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/User';
import { ParamsEmailVerify } from '../interfaces/Params-email-verify';
import { ResponseGlobalServer } from '../interfaces/Response-globalServer';
import { credentialsFormLogin } from '../interfaces/Credentials-form-login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Récupère le cookie CSRF pour Sanctum
   */
  getCsrfToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/csrf-cookie`, { withCredentials: true });
  }

  /**
   * Inscription d'un utilisateur
   * @param userData Données de l'utilisateur {name, email, password, password_confirmation}
   */
  register(userData: User): Observable<ResponseGlobalServer> {
    return this.http.post<ResponseGlobalServer>(`${this.apiUrl}/register`, userData);
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
      `${this.apiUrl}/email/verify/${paramsData.id}/${paramsData.hash}/${paramsData.uuid}`,{params}
    );
  }

  /**
   * Connexion de l'utilisateur
   * @param credentials {email, password}
   */
  login(credentials: credentialsFormLogin): Observable<ResponseGlobalServer> {
    return this.http.post<ResponseGlobalServer>(`${this.apiUrl}/login`, credentials);
  }

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): Observable<any> {
    return this.http.get(`${this.apiUrl}/logout`);
  }
}
