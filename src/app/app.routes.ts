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
  {
    path: 'privacy',
    loadComponent: () => import('./pages/privacy/privacy').then(m => m.PrivacyComponent),
  },
  {
    path: 'terms',
    loadComponent: () => import('./pages/terms/terms').then(m => m.TermsComponent),
  },
  {
    path: 'cookies',
    loadComponent: () => import('./pages/cookies/cookies').then(m => m.CookiesComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFoundComponent),
  },
];
