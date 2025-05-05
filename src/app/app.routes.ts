import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/posts/pages/home/home.component').then(m => m.HomeComponent) },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.component')
      .then(m => m.LoginComponent),
  },

  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register/register.component')
      .then(m => m.RegisterComponent),
  },

  {
    path: 'my-posts',
    loadComponent: () => import('./features/posts/pages/my-posts/my-posts.component')
      .then(m => m.MyPostsComponent),
    canActivate: [authGuard]
  },

  {
    path: 'analytics',
    loadComponent: () => import('./features/analytics/analytics-page.component')
      .then(m => m.AnalyticsPageComponent),
  },

  {
    path: 'posts',
    loadComponent: () => import('./features/posts/pages/post-list/post-list.component')
      .then(m => m.PostListComponent),
  },

  {
    path: 'posts/new',
    loadComponent: () => import('./features/posts/pages/post-form/post-form.component')
      .then(m => m.PostFormComponent),
    canActivate: [authGuard]
  },

  {
    path: 'posts/:id/edit',
    loadComponent: () => import('./features/posts/pages/post-form/post-form.component')
      .then(m => m.PostFormComponent),
    canActivate: [authGuard]
  },

  {
    path: 'posts/:id',
    loadComponent: () => import('./features/posts/pages/post-detail/post-detail.component')
      .then(m => m.PostDetailComponent),
  },

  { path: '**', redirectTo: 'posts' }
];

