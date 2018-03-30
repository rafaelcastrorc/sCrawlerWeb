import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth.service";
import {map} from "rxjs/operators";

// import {Spinkit} from 'ng-http-loader/spinkits';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  // public spinkit = Spinkit;
  collapsed = true;
  userLoggedIn: boolean;


  constructor(private auth: AuthService) {
  }

  ngOnInit() {
    this.userLoggedIn = false;
    //Check if user is connected to display logout button
    this.auth.verifyLoggingStatus2().subscribe(data=>{
      this.userLoggedIn = (data.status);
    })
  }


    /**
     * Collapses nav bar
     */
    toggleCollapsed()
  :
    void {
      this.collapsed = !this.collapsed;
  }


  }
