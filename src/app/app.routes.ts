import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './auth/components/login/login.component';
import { Authroutes } from './auth/services/auth.routes';

export const routes: Routes = [

    ...Authroutes,
    
];
