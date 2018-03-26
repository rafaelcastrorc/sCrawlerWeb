import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth.service";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email : string;
  password: string;

  constructor(private Auth: AuthService) { }

  ngOnInit() {
  }


  loginUser(event) {
    event.preventDefault();
    console.log(this.email + ' ' + this.password);
    this.Auth.loginUser(this.email, this.password);
  }
}
