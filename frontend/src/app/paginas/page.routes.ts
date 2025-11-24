import { Routes } from '@angular/router';

export const pageRoutes : Routes = [
    {path : '', pathMatch: 'full', redirectTo: 'dashboard'},
    {
        path : 'dashboard', 
        loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),
        data: { title: 'Resumen' }
    },
    {
        path : 'usuarios', 
        loadComponent: () => import('./usuarios/usuarios').then(m => m.Usuarios),
        data: { title: 'Gestión de usuarios' }
    },
    {
        path : 'clientes', 
        loadComponent: () => import('./clientes/clientes-main').then(m => m.ClientesMain),
        data: { title: 'Gestión de clientes' }
    },
    {
        path: 'productos',
        loadComponent: () => import('./productos/productos').then(m => m.Productos),
        data: { title: 'Gestión de productos' }
    },
    {
        path: 'ventas',
        loadComponent: () => import('./ventas/ventas').then(m => m.Ventas),
        data: { title: 'Gestión de ventas' }
    },
    {
        path: 'reportes',
        loadComponent: () => import('./reportes/reportes').then(m => m.Reportes),
        data: { title: 'Gestión de reportes' }
    },
    {
        path: 'perfil',
        loadComponent: () => import('./perfil-usuario/perfil-usuario').then(m => m.PerfilUsuario),
        data: { title: 'Perfil de usuario' }
    }
];