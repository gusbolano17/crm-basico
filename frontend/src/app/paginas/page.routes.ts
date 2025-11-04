import { Routes } from '@angular/router';

export const pageRoutes : Routes = [
    {path : '', pathMatch: 'full', redirectTo: 'dashboard'},
    {
        path : 'dashboard', 
        loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard)
    },
    {
        path : 'usuarios', 
        loadComponent: () => import('./usuarios/usuarios').then(m => m.Usuarios)
    },
    {
        path : 'clientes', 
        loadComponent: () => import('./clientes/clientes-main').then(m => m.ClientesMain)
    },
    {
        path: 'productos',
        loadComponent: () => import('./productos/productos').then(m => m.Productos)
    },
    {
        path: 'ventas',
        loadComponent: () => import('./ventas/ventas').then(m => m.Ventas)
    },
    {
        path: 'reportes',
        loadComponent: () => import('./reportes/reportes').then(m => m.Reportes)
    }
];