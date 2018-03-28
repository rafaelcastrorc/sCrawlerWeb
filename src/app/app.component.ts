import { Component } from '@angular/core';
// import {Spinkit} from 'ng-http-loader/spinkits';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sCrawler';
  // public spinkit = Spinkit;
  collapsed = true;

  /**
   * Collapses nav bar
   */
  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

}
