import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent),
  },
  {
    path: 'blog',
    loadComponent: () => import('./pages/blog-list/blog-list').then(m => m.BlogListComponent),
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./pages/blog-post/blog-post').then(m => m.BlogPostComponent),
  },
  {
    path: 'category/:slug',
    loadComponent: () => import('./pages/category/category').then(m => m.CategoryComponent),
  },
];
