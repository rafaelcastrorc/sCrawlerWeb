import { Component } from '@angular/core';
import {Spinkit} from 'ng-http-loader/spinkits';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sCrawler';
  public spinkit = Spinkit;

}
