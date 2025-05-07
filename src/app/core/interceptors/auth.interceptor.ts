import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
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

    /*if (request.url.includes('/posts')) {
      console.log(`[Interceptor] ${request.method} request to: ${request.url}`);
      console.log('[Interceptor] Authorization token exists:', !!token);

      if (request.params) {
        const params = request.params.keys().map(key => `${key}=${request.params.get(key)}`).join('&');
        console.log('[Interceptor] Request params:', params);
      }

      if (request.method === 'POST' || request.method === 'PUT') {
        console.log('[Interceptor] Request body:', JSON.stringify(request.body));
      }
    }*/

    if (token) {
      const authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      /*if (request.url.includes('/posts')) {
        console.log('[Interceptor] Added auth token to request');
      }*/

      return next.handle(authReq).pipe(
        tap(event => {
          if (request.url.includes('/posts')) {
            console.log('[Interceptor] Request successful');
          }
        }),
        catchError((error: HttpErrorResponse) => {
          if (request.url.includes('/posts')) {
            console.error('[Interceptor] HTTP error:', error.status);
            console.error('[Interceptor] Error URL:', request.url);
            console.error('[Interceptor] Error details:', error);

            if (error.error) {
              if (typeof error.error === 'object') {
                console.error('[Interceptor] Error message:', error.error.message || 'Unknown error');

                if (error.error.errors) {
                  console.error('[Interceptor] Validation errors:', error.error.errors);
                }
              }
            }
          }

          if (error.status === 401) {
            console.error('[Interceptor] Authentication error, logging out user');
            this.authService.logout();
            this.toastService.error('Sessão expirada. Por favor, faça login novamente.');
            this.router.navigate(['/login']);
          }

          return throwError(() => error);
        })
      );
    }

    if (request.url.includes('/posts') && request.method !== 'GET') {
      console.warn('[Interceptor] Attempting to access protected resource without token!');
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (request.url.includes('/posts') && error.status === 401) {
          console.error('[Interceptor] Authentication required for this endpoint');
          this.toastService.error('Autenticação necessária para acessar este recurso');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
