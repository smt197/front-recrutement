import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseGlobalServer } from '../interfaces/Response-globalServer';
import { User } from '../interfaces/User';

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
    return this.http.get(`${this.apiUrl}/csrf-cookie`, {
      withCredentials: true
    });
  }

  /**
   * Inscription d'un utilisateur
   * @param userData Données de l'utilisateur {name, email, password, password_confirmation}
   */
  register(userData: User): Observable<ResponseGlobalServer> {
    return this.http.post<ResponseGlobalServer>(
      `${this.apiUrl}/register`,
      userData
    );
  }

  /**
   * Connexion de l'utilisateur
   * @param credentials {email, password}
   */
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): Observable<any> {
    return this.http.get(`${this.apiUrl}/logout`);
  }
}
