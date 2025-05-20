import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserResponse } from '../../models/response/user-response.model';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow-md border-b border-blue-100 py-2">
      <div class="max-w-6xl mx-auto flex justify-between items-center px-8">
        <div>
          <a routerLink="/">
            <img
              [src]="'/assets/logo-blog-maker.png'"
              alt="Blog Maker Logo"
              class="h-14 w-auto"
              onerror="this.onerror=null; this.src='/assets/logo-blog-maker.png'; if(!this.complete) {this.style.display='none';}"
            />
          </a>
        </div>
        <div class="flex items-center">
          <nav class="flex text-gray-700 font-medium">
            <a routerLink="/" class="px-4 hover:text-blue-600 transition">Home</a>
            <a routerLink="/posts" class="px-4 hover:text-blue-600 transition">Posts</a>
            <a *ngIf="isAuthenticated" routerLink="/my-posts" class="px-4 hover:text-blue-600 transition">Meus Posts</a>
            <a routerLink="/analytics" class="px-4 hover:text-blue-600 transition">Analytics</a>
          </nav>

          <div *ngIf="!isAuthenticated" class="flex items-center ml-6 pl-6 border-l border-gray-200 space-x-4">
            <a
              routerLink="/login"
              class="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
            >
              Login
            </a>
            <a
              routerLink="/register"
              class="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-sm transition"
            >
              Cadastre-se
            </a>
          </div>

          <div *ngIf="isAuthenticated" class="flex items-center ml-6 pl-6 border-l border-gray-200">
            <div class="flex items-center">
              <div class="w-9 h-9 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                <img
                  *ngIf="currentUser?.photo"
                  [src]="currentUser?.photo"
                  [alt]="currentUser?.name"
                  class="w-full h-full object-cover"
                  onerror="this.onerror=null; this.style.display='none';"
                />
                <svg *ngIf="!currentUser?.photo" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
              </div>
              <span class="text-sm font-medium text-gray-700 mx-3">{{ currentUser?.name || 'Usuário' }}</span>
              <button
                (click)="logout()"
                class="text-sm font-medium px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  currentUser: UserResponse | null = null;
  private userSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkAuthState();

    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      console.log('Header received user update:', user);
      this.currentUser = user;
      this.isAuthenticated = !!user;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
      this.userSubscription = null;
    }
  }

  private checkAuthState(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.currentUser = this.authService.getCurrentUser();
    console.log('Header initial auth state:', this.isAuthenticated, this.currentUser);
  }

  logout(): void {
    this.authService.logout();
  }
}
