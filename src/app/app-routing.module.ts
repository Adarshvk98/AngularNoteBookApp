import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { AuthGuardGuard } from './providers/auth-guard.guard';

const routes: Routes = [
  {path:'', pathMatch:'full',redirectTo :'login'},
  {path:'login',component:LoginComponent},
  {path:'signup',component:RegisterComponent},
  {path:'dashboard',component:DashboardComponent,canActivate:[AuthGuardGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
