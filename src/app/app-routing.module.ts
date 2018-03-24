import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {ScrawlersComponent} from "./scrawlers/scrawlers.component";
import {VisualizerComponent} from "./scrawlers/visualizer/visualizer.component";
import {LoginComponent} from "./login/login.component";
import {Register} from "ts-node";
import {RegisterComponent} from "./register/register.component";

const routes: Routes = [
  // You can access the routes directly from the adress bar
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'scrawlers', component: ScrawlersComponent},
  {path: 'login', component:  LoginComponent},
  {path: 'register', component:  RegisterComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
