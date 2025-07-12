import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {jwtDecode} from 'jwt-decode';

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

export interface JwtPayload {
  usuario: string;
  roles: string | string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5138/api/v1.0/autenticacao';

  constructor(private http: HttpClient) {
  }

  login(usuario: string, senha: string): Observable<boolean> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/login`, {usuario, senha}).pipe(
      tap(res => {
        localStorage.setItem('token', res.access_token);
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUser(): { usuario: string; role: string } | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const roles = decoded.roles;
      const role = Array.isArray(roles) ? roles[0] : roles;

      return {
        usuario: decoded.usuario,
        role
      };
    } catch (error) {
      return null;
    }
  }

  isMaster(): boolean {
    const user = this.getUser();
    if (!user) return false;
    return user.role.toLowerCase() === 'master' || user.role.toLowerCase() === 'admin';
  }
}
