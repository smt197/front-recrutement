// import { AuthComponent } from "./auth.component";
import{AuthSmtComponent} from './auth-smt.component';
import { VexRoutes } from '@vex/interfaces/vex-route.interface';

const authRoute: VexRoutes = [
    // {
    //     path: '',
    //     component: AuthSmtComponent,
    //     children: [
    //         {
    //             path: '',
    //             redirectTo: 'login',
    //             pathMatch: 'full'
    //         },
    //         // {
    //         //     path: 'login',
    //         //     loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
    //         // },

    //         {
    //             path: 'register',
    //             loadComponent: () => import('./register-smt/register-smt.component').then((m) => m.RegisterSmtComponent),
    //         },
    //     ]
    // },

    {
        path: '',
        component: AuthSmtComponent,
        children: [
            {
                path: '',
                redirectTo: 'register',
                pathMatch: 'full'
            },
            {
                path: 'register',
                loadComponent: () => import('./register-smt/register-smt.component').then((m) => m.RegisterSmtComponent),
            },

            // {
            //     path: 'login',
            //     loadComponent: () => import('./login-smt/login-smt.component').then((m) => m.LoginSmtComponent),
            // },
        ]
    },
];

export default authRoute;