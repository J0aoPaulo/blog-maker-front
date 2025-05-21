import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    ToastComponent,
    HttpClientModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <app-sidebar #sidebar></app-sidebar>
      <div class="router-container transition-all duration-300"
           [ngClass]="{
             'md:ml-64': !sidebar.isCollapsed,
             'md:ml-16': sidebar.isCollapsed
           }">
        <div class="pt-4 md:pt-6 pl-16 md:pl-6 pr-4 pb-8">
          <router-outlet></router-outlet>
        </div>
      </div>
      <app-toast></app-toast>
    </div>
  `,
  styles: [],
})
export class AppComponent {
  title = 'blog-maker-front';
}
