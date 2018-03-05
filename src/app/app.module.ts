import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {AppRoutingModule} from "./app-routing.module";
import { ScrawlersComponent } from './scrawlers/scrawlers.component';
import {FormsModule} from "@angular/forms";
import { DropdownModule } from 'ngx-dropdown';
import { HttpClientModule } from '@angular/common/http';
import { NgHttpLoaderModule } from "ng-http-loader/ng-http-loader.module";
import { ChartsModule } from 'ng2-charts';
import { ScrawlerListComponent } from './scrawlers/scrawler-list/scrawler-list.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ScrawlersComponent,
    ScrawlerListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    DropdownModule,
    HttpClientModule,
    NgHttpLoaderModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
