import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideZoneChangeDetection }            from '@angular/core';
import { provideRouter }                        from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi }   from '@angular/common/http';
import { routes }             from './app.routes';
import { AuthInterceptor }    from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Mantém a detecção de zona otimizada
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Roteamento
    provideRouter(routes),

    // HTTP Client + nosso AuthInterceptor
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch()
    ),

    // agora registrar o seu interceptor como provider
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },

    // animações + Material
    provideAnimations(),
    importProvidersFrom(BrowserAnimationsModule, MatSnackBarModule)
  ]
};
