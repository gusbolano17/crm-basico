import { Routes } from '@angular/router';
import { authGuard } from './core/auth-guard';

export const routes: Routes = [
    {path : '', pathMatch: 'full', redirectTo: 'login'},
    {path : 'login', 
        loadComponent: () => import('./paginas/login/login').then(m => m.Login)
    },
    {
        path : 'main', 
        canActivate: [authGuard],
        loadComponent: () => import('./paginas/main/main').then(m => m.Main),
        loadChildren: () => import('./paginas/page.routes').then(m => m.pageRoutes)
    }
];
