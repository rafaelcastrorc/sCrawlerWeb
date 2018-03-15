import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {ScrawlersComponent} from "./scrawlers/scrawlers.component";
import {VisualizerComponent} from "./scrawlers/visualizer/visualizer.component";

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'scrawlers', component: ScrawlersComponent},
  {path: 'visualizer', component:  VisualizerComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
