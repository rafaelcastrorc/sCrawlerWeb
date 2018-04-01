import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";

// import {Spinkit} from 'ng-http-loader/spinkits';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // public spinkit = Spinkit;
  collapsed = true;
  userLoggedIn: boolean;
  logoutResultMessage: string;
  logoutMessageTitle: string;


  constructor(private auth: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.userLoggedIn = false;
    //Check if user is connected to display logout button

    //First check if the user is already connected and its just coming back to the page
    this.auth.verifyLoggingStatus2().subscribe(data => {
      this.userLoggedIn = (data.status);
    });

    //If not, listen to changes in login or register
    this.auth.observableStatus.subscribe(status => this.userLoggedIn = status);
  }

  /**
   * Listes to change in status by children component
   * @param {boolean} val
   */
  onLoginStatus(val: boolean) {
    this.userLoggedIn = val;
  }

  /**
   * Collapses nav bar
   */
  toggleCollapsed():
    void {
    this.collapsed = !this.collapsed;
  }


  /**
   * Logs the user out
   */
  logout() {
    this.auth.logout().subscribe(data => {
      //Show pop up that logout work and take user to home page
      if (data.success) {
        this.logoutMessageTitle = "Success";
        this.logoutResultMessage = "Successfully logged out!";
        this.userLoggedIn = false;
        this.auth.setLoggedIn(false);
      } else {
        //Show error
        this.logoutMessageTitle = "ERROR";
        this.logoutResultMessage = "There was a problem logging you out."
      }
    })
  }
}
