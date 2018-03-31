import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {ScrawlersComponent} from "./scrawlers/scrawlers.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {AuthGuard} from "./auth.guard";
import {AboutComponent} from "./about/about.component";
import {NegAuthGuard} from "./neg-auth.guard";

const routes: Routes = [
  // You can access the routes directly from the adress bar
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'scrawlers', component: ScrawlersComponent, canActivate: [AuthGuard]},
  {path: 'login', component:  LoginComponent, canActivate: [NegAuthGuard]},
  {path: 'register', component:  RegisterComponent, canActivate: [NegAuthGuard]},
  {path: 'about', component:  AboutComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
