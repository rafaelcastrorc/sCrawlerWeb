import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  //Logs in the user
  getUserDetails(email: string, password: string) {
    return this.http.post('/api_users/login', {
      email,
      password
    }).subscribe(data => {
      console.log(data, 'data returned from server');
    })

  }


  //Logs in the user
  registerUser(firstname:string, lastname:string, email: string, password: string) {
    return this.http.post('/api_users/register', {
      firstname,
      lastname,
      email,
      password
    }).subscribe(data => {
      console.log(data, 'data returned from server');
    })

  }

}
