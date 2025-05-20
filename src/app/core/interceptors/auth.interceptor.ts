import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    if (token) {
      return this.handleAuthenticatedRequest(request, next, token);
    }

    return this.handleUnauthenticatedRequest(request, next);
  }

  private handleAuthenticatedRequest(
    request: HttpRequest<unknown>,
    next: HttpHandler,
    token: string
  ): Observable<HttpEvent<unknown>> {
    const authReq = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.handleAuthenticationError();
        }
        return throwError(() => error);
      })
    );
  }

  private handleUnauthenticatedRequest(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (this.isProtectedPostRequest(request) && error.status === 401) {
          this.toastService.error('Autenticação necessária para acessar este recurso');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  private handleAuthenticationError(): void {
    this.authService.logout();
    this.toastService.error('Sessão expirada. Por favor, faça login novamente.');
    this.router.navigate(['/login']);
  }

  private isProtectedPostRequest(request: HttpRequest<unknown>): boolean {
    return request.url.includes('/posts') && request.method !== 'GET';
  }
}
