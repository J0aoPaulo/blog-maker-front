import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'posts',
    loadComponent: () =>
      import('./features/posts/pages/post-list/post-list.component').then(
        (m) => m.PostListComponent),
  },
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
];
