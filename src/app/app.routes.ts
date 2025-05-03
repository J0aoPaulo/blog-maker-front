import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/posts/pages/home/home.component').then(m => m.HomeComponent) },

  {
    path: 'posts',
    loadComponent: () => import('./features/posts/pages/post-list/post-list.component')
      .then(m => m.PostListComponent),
  },

  {
    path: 'posts/new',
    loadComponent: () => import('./features/posts/pages/post-form/post-form.component')
      .then(m => m.PostFormComponent),
  },

  {
    path: 'posts/:id/edit',
    loadComponent: () => import('./features/posts/pages/post-form/post-form.component')
      .then(m => m.PostFormComponent),
  },

  {
    path: 'posts/:id',
    loadComponent: () => import('./features/posts/pages/post-detail/post-detail.component')
      .then(m => m.PostDetailComponent),
  },

  { path: '**', redirectTo: 'posts' }
];

