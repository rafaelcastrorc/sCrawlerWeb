import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

   firstname: string;
   lastname: string;
   email: string;
   password: string;
   error: string;

  constructor(private Auth: AuthService, private router: Router) {
  }

  ngOnInit() {
  }

  registerUser(event) {
    event.preventDefault();
    this.Auth.registerUser(this.firstname, this.lastname, this.email, this.password)
      .subscribe(
        data => {
          //Redirect person to scrawler page
          this.Auth.verifyLoggingStatus();
          this.router.navigate(['scrawlers']);
        },

        error => {
          this.error = error.error;
          window.alert(this.error);
        }
      );
  }

}
