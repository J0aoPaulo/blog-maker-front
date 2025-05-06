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
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(routes),

    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch()
    ),

    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },

    provideAnimations(),
    importProvidersFrom(BrowserAnimationsModule, MatSnackBarModule)
  ]
};
