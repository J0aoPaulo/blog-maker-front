import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    ToastComponent,
    HttpClientModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <app-header></app-header>
      <router-outlet></router-outlet>
      <app-toast></app-toast>
    </div>
  `,
  styles: [],
})
export class AppComponent {
  title = 'blog-maker-front';
}
