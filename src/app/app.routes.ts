import { authGuard } from './guards/auth.guard';
import { LayoutComponent } from './layouts/layout/layout.component';
import { VexRoutes } from '@vex/interfaces/vex-route.interface';

export const appRoutes: VexRoutes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth-routes')
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'index',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          )
      }
      // {
      //   path: '**',
      //   loadComponent: () =>
      //     import('./auth/errors/error-404/error-404.component').then(
      //       (m) => m.Error404Component
      //     )
      // }
    ]
  }
];
