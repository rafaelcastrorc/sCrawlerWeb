import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  inputFirstNameText: string;
   inputLastNameText: string;
   inputEmailText: string;
  inputPasswordText: string;
   error: string;
   thereWasAnError = false;

  constructor(private Auth: AuthService, private router: Router) {
  }

  ngOnInit() {
  }

  registerUser(event) {
    this.thereWasAnError = false;
    event.preventDefault();
    this.Auth.registerUser(this.inputFirstNameText, this.inputLastNameText, this.inputEmailText, this.inputPasswordText)
      .subscribe(
        data => {
          //If there is no message, registration was successful
          if (data.message === 'success') {
            //Redirect person to scrawler page
            this.Auth.verifyLoggingStatus();
            this.router.navigate(['scrawlers']);
          } else {
            this.thereWasAnError = true;
            this.error = data.message;
            if (this.error === 'email') {
              this.error = 'The email you submitted is invalid!'
            } else if (this.error === 'password') {
              this.error = 'The password you submitted is invalid!'
            } else if (this.error=== 'firstname') {
              this.error = 'The first name you submitted is invalid!'
            } else if (this.error=== 'lastname') {
              this.error = 'The last name you submitted is invalid!'
            } else {
              //If it is not any of those errors, then show a pop up window
              window.alert(this.error);
            }
          }

        });
  }

}
