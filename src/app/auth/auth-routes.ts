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
        ]
    },
];

export default authRoute;