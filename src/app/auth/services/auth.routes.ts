import { Routes } from "@angular/router";



export const Authroutes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('../../dashboard/dashboard.component').then(m => m.DashboardComponent)
    }, 
    {
        path: '',
        loadComponent: () => import('../components/login/login.component').then(m => m.LoginComponent)
    }
]