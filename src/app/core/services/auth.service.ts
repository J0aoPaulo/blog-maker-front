import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { UserResponse } from '../models/response/user-response.model';
import { AuthRequest } from '../models/request/auth-request.model';
import { RegisterRequest } from '../models/request/register-request.model';
import { AuthResponse } from '../models/response/auth-response.model';
import { UpdateUserRequest } from '../models/response/update-user-request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.api}/auth`;
  private userUrl = `${environment.api}/users`;

  private currentUserSubject = new BehaviorSubject<UserResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private tokenKey = 'auth_token';
  private userKey = 'user_data';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.ngZone.run(() => {
        this.loadUserFromStorage();
      });
    }
  }

  private loadUserFromStorage(): void {
    if (!this.isBrowser) return;

    try {
      const token = localStorage.getItem(this.tokenKey);
      const userData = localStorage.getItem(this.userKey);

      if (!token || token === 'undefined' || token === 'null') {
        console.log('Token inválido ou não encontrado no storage');
        return;
      }

      if (!userData || userData === 'undefined' || userData === 'null') {
        console.log('Dados de usuário inválidos ou não encontrados no storage');
        return;
      }

      const user = JSON.parse(userData) as UserResponse;
      console.log('Loaded user from storage:', user);
      this.currentUserSubject.next(user);
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      this.clearStorageData();
    }
  }

  private clearStorageData(): void {
    if (this.isBrowser) {
      try {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
      } catch (e) {
        console.error('Erro ao limpar dados do localStorage', e);
      }
    }
    this.currentUserSubject.next(null);
  }

  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          console.log('Login successful:', response);

          const authResponse: AuthResponse = {
            token: response.token || response,
            user: response.user || null
          };

          this.handleAuthentication(authResponse);
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => new Error(error.error?.message || 'Falha ao realizar login. Verifique suas credenciais.'));
        })
      );
  }

  register(userData: RegisterRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        catchError(error => {
          console.error('Register error:', error);
          return throwError(() => new Error(error.error?.message || 'Falha ao realizar cadastro. Tente novamente.'));
        })
      );
  }

  logout(): void {
    this.clearStorageData();

    this.ngZone.run(() => {
      this.router.navigate(['/login']);
    });
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;

    try {
      const token = localStorage.getItem(this.tokenKey);
      if (!token || token === 'undefined' || token === 'null') {
        return null;
      }
      return token;
    } catch (e) {
      console.error('Erro ao obter token', e);
      return null;
    }
  }

  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));

      console.log('JWT payload:', payload);

      return payload.sub || payload.id || payload.userId || payload.user_id || null;
    } catch (e) {
      console.error('Erro ao decodificar token JWT:', e);
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  getCurrentUser(): UserResponse | null {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      console.log('Current user from subject:', currentUser);
      return currentUser;
    }

    if (this.getToken()) {
      this.loadUserFromStorage();
      if (this.currentUserSubject.value) {
        console.log('Current user after loading from storage:', this.currentUserSubject.value);
        return this.currentUserSubject.value;
      }

      const defaultUser: UserResponse = {
        name: 'Usuário',
        email: 'usuario@example.com',
        role: 'user',
        photo: null
      };

      console.log('Using default user:', defaultUser);

      this.ngZone.run(() => {
        this.currentUserSubject.next(defaultUser);
        if (this.isBrowser) {
          try {
            localStorage.setItem(this.userKey, JSON.stringify(defaultUser));
          } catch (e) {
            console.error('Erro ao salvar usuário default', e);
          }
        }
      });

      return defaultUser;
    }

    console.log('No authenticated user found');
    return null;
  }

  updateUserProfile(userId: string, userData: UpdateUserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.userUrl}/${userId}`, userData)
      .pipe(
        tap(updatedUser => {
          console.log('User profile updated:', updatedUser);
          if (this.isBrowser && updatedUser) {
            try {
              localStorage.setItem(this.userKey, JSON.stringify(updatedUser));
            } catch (e) {
              console.error('Erro ao salvar dados do usuário', e);
            }
          }
          this.ngZone.run(() => {
            this.currentUserSubject.next(updatedUser);
          });
        }),
        catchError(error => {
          console.error('Update profile error:', error);
          return throwError(() => new Error(error.error?.message || 'Falha ao atualizar perfil. Tente novamente.'));
        })
      );
  }

  changePassword(userId: string, currentPassword: string, newPassword: string): Observable<boolean> {
    return this.http.put<UserResponse>(`${this.userUrl}/${userId}/change-password`, {
      currentPassword,
      newPassword
    }).pipe(
      map(() => true),
      catchError(error => {
        console.error('Change password error:', error);
        return throwError(() => new Error(error.error?.message || 'Falha ao alterar senha. Verifique sua senha atual.'));
      })
    );
  }

  private handleAuthentication(authResponse: AuthResponse): void {
    console.log('Raw auth response:', authResponse);

    const user = authResponse?.user || {
      name: 'Usuário',
      email: authResponse?.token ? 'usuario@example.com' : '',
      role: 'user',
      photo: null
    };

    console.log('Handling authentication for user:', user);

    if (this.isBrowser && authResponse?.token) {
      try {
        localStorage.setItem(this.tokenKey, authResponse.token);
        localStorage.setItem(this.userKey, JSON.stringify(user));
      } catch (e) {
        console.error('Erro ao salvar dados de autenticação', e);
      }
    }

    this.ngZone.run(() => {
      this.currentUserSubject.next(user);
    });
  }
}
