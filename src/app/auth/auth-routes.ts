import { AuthComponent } from "./auth.component";
import { VexRoutes } from '@vex/interfaces/vex-route.interface';

const authRoute: VexRoutes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
            },

            {
                path: 'register',
                loadComponent: () => import('./register/register.component').then((m) => m.RegisterComponent),
            },
            {
                path: 'email/verify/:id/:hash/:uuid',
                loadComponent: () => import('./email-verify/email-verify.component').then((m) => m.EmailVerifyComponent),
            },
            {
                path: '**',
                loadComponent: () =>
                  import('./errors/error-404/error-404.component').then(
                    (m) => m.Error404Component
                  )
              }
        ]
    },
];

export default authRoute;