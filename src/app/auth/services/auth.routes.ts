import { Routes } from "@angular/router";



export const Authroutes: Routes = [
    {
        path: 'dash',
        loadComponent: () => import('../../dashboard/dashboard.component').then(m => m.DashboardComponent)
    }, 
    {
        path: 'map',
        loadComponent: () => import('../components/maps/maps.component').then(m => m.MapsComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('../components/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'payment',
        loadComponent: () => import('../components/payment/payment.component').then(m => m.PaymentComponent)
    },
    {
        path: '',
        loadComponent: () => import('../components/maps/maps.component').then(m => m.MapsComponent)
    },
]