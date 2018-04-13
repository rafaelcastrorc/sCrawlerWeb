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
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { RegisterComponent } from './register/register.component';
import {AuthService} from "./services/auth.service";
import {AuthGuard} from "./auth.guard";
import {ParticlesModule} from "angular-particle";
import { AboutComponent } from './about/about.component';
import {NegAuthGuard} from "./neg-auth.guard";
import {IconsModule} from "./icons/icons.module";
import { OverviewComponent } from './scrawlers/overview/overview.component';
import {DashboardService} from "./services/dashboard.service";
import { OrderModule } from 'ngx-order-pipe';
import { ProxiesComponent } from './scrawlers/proxies/proxies.component';
import {MatTableModule, MatPaginatorModule} from "@angular/material";
import {CdkTableModule} from '@angular/cdk/table';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { InstancesComponent } from './scrawlers/instances/instances.component';
import { ManageComponent } from './scrawlers/manage/manage.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ScrawlersComponent,
    LoginComponent,
    AdminComponent,
    RegisterComponent,
    AboutComponent,
    OverviewComponent,
    ProxiesComponent,
    InstancesComponent,
    ManageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    DropdownModule,
    HttpClientModule,
    ParticlesModule,
    IconsModule,
    ChartsModule,
    OrderModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    BrowserAnimationsModule
  ],
  providers: [AuthService, AuthGuard, NegAuthGuard, DashboardService],
  bootstrap: [AppComponent],
})
export class AppModule { }
