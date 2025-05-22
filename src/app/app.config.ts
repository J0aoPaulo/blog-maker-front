import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt, 'pt-BR');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(routes),

    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch()
    ),

    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'pt-BR' },

    provideAnimations(),
    importProvidersFrom(BrowserAnimationsModule, MatSnackBarModule)
  ]
};
