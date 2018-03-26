import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

/*
 Handles the user data once they are logged in
 */
interface myData {
  message: string,
  sucsess: boolean
}

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }
  getUserData() {
    return this.http.get<myData>('/api_users/getauth');
  }





  // isLoggedIn(): Observable<isLoggedIn> {
  //   return this.http.get<isLoggedIn>('/api_users/isloggedin')
  // }
  //
  // logout() {
  //   return this.http.get<logoutStatus>('api_users/logout')
  // }
}
