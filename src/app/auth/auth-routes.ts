import { noAuthGuard } from "../guards/no-auth.guard";
import { AuthComponent } from "./auth.component";
import { VexRoutes } from '@vex/interfaces/vex-route.interface';

const authRoute: VexRoutes = [
    {
        path: '',
        component: AuthComponent,
            canActivate:[noAuthGuard],
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
                path: 'forgot-password',
                loadComponent: () => import('./forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
            },
            {
                path: 'email/verify/:id/:hash/:uuid',
                loadComponent: () => import('./email-verify/email-verify.component').then((m) => m.EmailVerifyComponent),
            },
            // {
            //     path: '**',
            //     loadComponent: () =>
            //       import('./errors/error-404/error-404.component').then(
            //         (m) => m.Error404Component
            //       )
            // }
        ]
    },
];

export default authRoute;