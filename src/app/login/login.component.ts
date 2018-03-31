import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../auth.service";
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


  constructor(private Auth: AuthService, private router: Router ) {
  }

  ngOnInit() {
  }


  loginUser(event) {
    this.thereWasAnError = false;
    event.preventDefault();
    this.Auth.loginUser(this.email, this.password).subscribe(
      data => {
        //If there is no message, registration was successful
        if (data.message === 'success') {
          //Redirect person to scrawler page
          this.Auth.verifyLoggingStatus();
          this.router.navigate(['scrawlers']);
          this.onLoginStatus.emit(true);
        } else {
          this.thereWasAnError = true;
          this.error = data.message;
        }
      });
  }

}
