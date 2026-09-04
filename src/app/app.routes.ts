import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { LayoutComponent } from './layouts/layout/layout.component';
import { VexRoutes } from '@vex/interfaces/vex-route.interface';

export const appRoutes: VexRoutes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth-routes').then((m) => m.authRoute)
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
        canActivate: [roleGuard],
        data: { roles: ['RECRUTEUR', 'ADMIN'] },
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          )
      },
      {
        path: 'candidate-dashboard',
        canActivate: [roleGuard],
        data: { roles: ['CANDIDATE'] },
        loadComponent: () =>
          import(
            './pages/candidate-dashboard/candidate-dashboard.component'
          ).then((m) => m.CandidateDashboardComponent)
      },
      {
        path: 'job',
        loadComponent: () =>
          import('./pages/jobs/jobs.component').then((m) => m.JobsComponent)
      }
    ]
  }
];
