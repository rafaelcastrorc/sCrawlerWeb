import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;
  thereWasAnError: boolean;
  error: string;
  @Output() onLoginStatus = new EventEmitter<boolean>();


  constructor(private auth: AuthService, private router: Router ) {
  }

  ngOnInit() {
  }


  loginUser(event) {
    this.thereWasAnError = false;
    event.preventDefault();
    this.auth.loginUser(this.email, this.password).subscribe(
      data => {
        //If there is no message, registration was successful
        if (data.message === 'success') {
          this.auth.verifyLoggingStatus();
          //Notify header that there is a user logged in (To display
          // logout button)
          this.onLoginStatus.emit(true);
          //Change the name of the user in auth service
          this.auth.setUserName(data.firstName, data.lastName);
          //Redirect person to scrawler page
          this.router.navigate(['scrawlers']);


        } else {
          this.thereWasAnError = true;
          this.error = data.message;
        }
      });
  }

}
