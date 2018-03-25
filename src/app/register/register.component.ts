import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  protected firstname: string;
  protected lastname: string;
  protected email: string;
  protected password: string;
  private error: string;

  constructor(private Auth: AuthService) {
  }

  ngOnInit() {
  }

  loginUser(event) {
    event.preventDefault();
    this.Auth.registerUser(this.firstname, this.lastname, this.email, this.password)
      .subscribe(
        data => {
          //Redirect person to scrawler page
        },
        error => {
          this.error = error.error;
          window.alert(this.error);
        }
      );
  }

}
