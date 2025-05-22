import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserResponse } from '../../models/response/user-response.model';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="fixed top-0 left-0 bottom-0 bg-white shadow-lg transform transition-all duration-300 ease-in-out z-30 flex flex-col"
      [class.w-64]="!isCollapsed && isOpen"
      [class.w-16]="isCollapsed && isOpen"
      [class.translate-x-0]="isOpen"
      [class.translate-x-[-100%]]="!isOpen"
    >
      <div class="flex items-center border-b border-gray-100 p-4 justify-between">
        <div class="flex items-center space-x-2" [class.justify-center]="isCollapsed" [class.w-full]="isCollapsed">
          <div class="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white text-lg font-bold">
            B
          </div>
          <span *ngIf="!isCollapsed" class="font-semibold text-gray-800 whitespace-nowrap">Blog Maker</span>
        </div>

        <button
          *ngIf="!isCollapsed"
          (click)="toggleCollapse()"
          class="text-gray-500 hover:text-blue-600 p-1 rounded-md hover:bg-gray-100"
          title="Recolher menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <button
        *ngIf="isCollapsed"
        (click)="toggleCollapse()"
        class="mx-auto mt-4 p-2 rounded-full bg-gray-100 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
        title="Expandir menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div
        class="p-4 border-b border-gray-100 flex items-center"
        [class.justify-center]="isCollapsed"
        [class.space-x-3]="!isCollapsed"
        [class.mt-0]="!isCollapsed"
        [class.mt-2]="isCollapsed"
      >
        <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
          <img
            *ngIf="currentUser?.photo"
            [src]="currentUser?.photo"
            [alt]="currentUser?.name"
            class="w-full h-full object-cover"
            (error)="handleImageError($event)"
          />
          <div
            *ngIf="!currentUser?.photo"
            class="w-full h-full bg-gray-200 flex items-center justify-center"
          >
            <span class="text-gray-600 text-sm font-medium">
              {{ getUserInitial() }}
            </span>
          </div>
        </div>

        <div *ngIf="!isCollapsed" class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">
            {{ currentUser?.name || 'Usuário' }}
          </p>
          <p class="text-xs text-gray-500 truncate">{{ currentUser?.email || '' }}</p>
        </div>
      </div>

      <nav class="py-6 px-2 overflow-y-auto flex-grow">
        <div class="space-y-1">
          <a routerLink="/" routerLinkActive="bg-blue-50 text-blue-600" [routerLinkActiveOptions]="{exact: true}"
            class="flex items-center py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            [class.px-3]="!isCollapsed"
            [class.justify-center]="isCollapsed"
            [class.px-1]="isCollapsed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" [ngClass]="{'mx-auto': isCollapsed, 'mr-3': !isCollapsed}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span *ngIf="!isCollapsed">Home</span>
          </a>

          <a routerLink="/posts" routerLinkActive="bg-blue-50 text-blue-600"
            class="flex items-center py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            [class.px-3]="!isCollapsed"
            [class.justify-center]="isCollapsed"
            [class.px-1]="isCollapsed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" [ngClass]="{'mx-auto': isCollapsed, 'mr-3': !isCollapsed}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <span *ngIf="!isCollapsed">Posts</span>
          </a>

          <a *ngIf="isAuthenticated" routerLink="/my-posts" routerLinkActive="bg-blue-50 text-blue-600"
            class="flex items-center py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            [class.px-3]="!isCollapsed"
            [class.justify-center]="isCollapsed"
            [class.px-1]="isCollapsed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" [ngClass]="{'mx-auto': isCollapsed, 'mr-3': !isCollapsed}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span *ngIf="!isCollapsed">Meus Posts</span>
          </a>

          <a *ngIf="isAuthenticated" routerLink="/posts/new" routerLinkActive="bg-blue-50 text-blue-600"
            class="flex items-center py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            [class.px-3]="!isCollapsed"
            [class.justify-center]="isCollapsed"
            [class.px-1]="isCollapsed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" [ngClass]="{'mx-auto': isCollapsed, 'mr-3': !isCollapsed}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span *ngIf="!isCollapsed">Novo Post</span>
          </a>

          <a routerLink="/analytics" routerLinkActive="bg-blue-50 text-blue-600"
            class="flex items-center py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            [class.px-3]="!isCollapsed"
            [class.justify-center]="isCollapsed"
            [class.px-1]="isCollapsed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" [ngClass]="{'mx-auto': isCollapsed, 'mr-3': !isCollapsed}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span *ngIf="!isCollapsed">Analytics</span>
          </a>
        </div>
      </nav>

      <div class="border-t border-gray-100 p-4 mt-auto" [class.text-center]="isCollapsed">
        <div *ngIf="!isAuthenticated" class="flex flex-col space-y-2">
          <a *ngIf="!isCollapsed" routerLink="/login"
            class="flex justify-center items-center px-4 py-2 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Login
          </a>
          <a routerLink="/register"
            class="flex justify-center items-center rounded-md bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            [class.py-2]="!isCollapsed"
            [class.px-4]="!isCollapsed"
            [class.p-2]="isCollapsed"
          >
            <span *ngIf="!isCollapsed">Cadastre-se</span>
            <svg *ngIf="isCollapsed" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </a>
        </div>

        <button *ngIf="isAuthenticated" (click)="logout()"
          class="flex items-center justify-center rounded-md bg-red-500 text-sm font-medium text-white hover:bg-red-600 transition-colors"
          [class.w-full]="!isCollapsed"
          [class.py-2]="!isCollapsed"
          [class.px-4]="!isCollapsed"
          [class.p-2]="isCollapsed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" [class.mr-2]="!isCollapsed" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span *ngIf="!isCollapsed">Sair</span>
        </button>
      </div>
    </div>

    <button
      (click)="toggleSidebar()"
      class="fixed top-4 left-4 z-40 p-2 rounded-md bg-blue-600 shadow-md text-white hover:bg-blue-700 md:hidden"
    >
      <svg
        *ngIf="!isOpen"
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <svg
        *ngIf="isOpen"
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <div
      *ngIf="isOpen && !isDesktop"
      (click)="closeSidebar()"
      class="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity"
    ></div>
  `,
  styles: [`
    :host {
      display: block;
    }

    @media (min-width: 768px) {
      :host {
        display: block;
      }

      .fixed.left-0 {
        transform: translateX(0) !important;
      }
    }
  `]
})
export class SidebarComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  currentUser: UserResponse | null = null;
  isOpen = false;
  isCollapsed = false;
  isDesktop = false;
  private userSubscription: Subscription | null = null;
  private readonly assetPath = '/assets/male-placeholder.png';

  constructor(private readonly authService: AuthService) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.checkAuthState();
    this.checkScreenSize();

    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
      this.userSubscription = null;
    }
  }

  private checkScreenSize(): void {
    this.isDesktop = window.innerWidth >= 768;
    if (this.isDesktop) {
      this.isOpen = true;
    }
  }

  private checkAuthState(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.currentUser = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
    this.closeSidebar();
  }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  closeSidebar(): void {
    if (!this.isDesktop) {
      this.isOpen = false;
    }
  }

  getUserInitial(): string {
    return this.currentUser?.name ? this.currentUser.name.charAt(0).toUpperCase() : 'U';
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.assetPath;
  }
}
