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
    path: 'slides/drf-api-logger',
    loadComponent: () => import('./pages/slides/drf-api-logger-slides').then(m => m.DrfApiLoggerSlidesComponent),
  },
  {
    path: 'slides/python-c-extensions',
    loadComponent: () => import('./pages/slides/python-c-extensions-slides').then(m => m.PythonCExtSlidesComponent),
  },
  {
    path: 'slides/:slug',
    loadComponent: () => import('./pages/slides/auto-slides').then(m => m.AutoSlidesComponent),
  },
  {
    path: 'slides/:slug',
    loadComponent: () => import('./pages/slides/auto-slides').then(m => m.AutoSlidesComponent),
  },
  {
    path: 'category/:slug',
    loadComponent: () => import('./pages/category/category').then(m => m.CategoryComponent),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then(m => m.AboutComponent),
  },
  {
    path: 'consultation',
    loadComponent: () => import('./pages/consultation/consultation').then(m => m.ConsultationComponent),
  },
  // Games — all lazy-loaded (each route is a separate chunk)
  {
    path: 'games',
    loadComponent: () => import('./pages/games/hub/hub').then(m => m.GamesHubComponent),
  },
  {
    path: 'games/guess-output',
    loadComponent: () => import('./pages/games/guess-output/guess-output').then(m => m.GuessOutputComponent),
  },
  {
    path: 'games/spot-the-bug',
    loadComponent: () => import('./pages/games/spot-the-bug/spot-the-bug').then(m => m.SpotTheBugComponent),
  },
  {
    path: 'games/devops-scenario',
    loadComponent: () => import('./pages/games/devops-scenario/devops-scenario').then(m => m.DevopsScenarioComponent),
  },
  {
    path: 'games/typing-test',
    loadComponent: () => import('./pages/games/typing-test/typing-test').then(m => m.TypingTestComponent),
  },
  {
    path: 'games/salary-calculator',
    loadComponent: () => import('./pages/games/salary-calculator/salary-calculator').then(m => m.SalaryCalculatorComponent),
  },
  {
    path: 'games/linux-challenge',
    loadComponent: () => import('./pages/games/linux-challenge/linux-challenge').then(m => m.LinuxChallengeComponent),
  },
  // Cheat Sheets — all lazy-loaded
  {
    path: 'cheatsheets',
    loadComponent: () => import('./pages/cheatsheets/hub/hub').then(m => m.CheatsheetsHubComponent),
  },
  {
    path: 'cheatsheets/python',
    loadComponent: () => import('./pages/cheatsheets/python/python').then(m => m.PythonCheatsheetComponent),
  },
  {
    path: 'cheatsheets/kubernetes',
    loadComponent: () => import('./pages/cheatsheets/kubernetes/kubernetes').then(m => m.KubernetesCheatsheetComponent),
  },
  {
    path: 'cheatsheets/git',
    loadComponent: () => import('./pages/cheatsheets/git/git').then(m => m.GitCheatsheetComponent),
  },
  {
    path: 'cheatsheets/docker',
    loadComponent: () => import('./pages/cheatsheets/docker/docker').then(m => m.DockerCheatsheetComponent),
  },
  {
    path: 'cheatsheets/sql',
    loadComponent: () => import('./pages/cheatsheets/sql/sql').then(m => m.SqlCheatsheetComponent),
  },
  // Courses — all lazy-loaded
  {
    path: 'courses',
    loadComponent: () => import('./pages/courses/hub/hub').then(m => m.CoursesHubComponent),
  },
  {
    path: 'courses/mastering-spiffe-spire',
    loadComponent: () => import('./pages/courses/course-landing/course-landing').then(m => m.CourseLandingComponent),
  },
  {
    path: 'courses/cloud-native-security-engineering',
    loadComponent: () => import('./pages/courses/course-landing/course-landing').then(m => m.CourseLandingComponent),
  },
  {
    path: 'courses/mastering-spiffe-spire/:moduleSlug/slides',
    loadComponent: () => import('./pages/courses/course-slides/course-slides').then(m => m.CourseSlidesComponent),
  },
  {
    path: 'courses/mastering-spiffe-spire/:moduleSlug',
    loadComponent: () => import('./pages/courses/course-module/course-module').then(m => m.CourseModuleComponent),
  },
  {
    path: 'courses/cloud-native-security-engineering/:moduleSlug/slides',
    loadComponent: () => import('./pages/courses/course-slides/course-slides').then(m => m.CourseSlidesComponent),
  },
  {
    path: 'courses/cloud-native-security-engineering/:moduleSlug',
    loadComponent: () => import('./pages/courses/course-module/course-module').then(m => m.CourseModuleComponent),
  },
  {
    path: 'courses/:seoSlug',
    loadComponent: () => import('./pages/courses/seo-landing/seo-landing').then(m => m.SeoLandingComponent),
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
