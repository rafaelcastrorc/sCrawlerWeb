import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {AppRoutingModule} from "./app-routing.module";
import { ScrawlersComponent } from './scrawlers/scrawlers.component';
import {FormsModule} from "@angular/forms";
import { DropdownModule } from 'ngx-dropdown';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { VisualizerComponent } from './scrawlers/visualizer/visualizer.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { RegisterComponent } from './register/register.component';
import {AuthService} from "./auth.service";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ScrawlersComponent,
    VisualizerComponent,
    LoginComponent,
    AdminComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    DropdownModule,
    HttpClientModule,
    ChartsModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
