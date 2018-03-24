import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }
  //
  // getData() {
  //   return this.http.get<myData>('/api_users/data');
  // }
  //
  // isLoggedIn(): Observable<isLoggedIn> {
  //   return this.http.get<isLoggedIn>('/api_users/isloggedin')
  // }
  //
  // logout() {
  //   return this.http.get<logoutStatus>('api_users/logout')
  // }
}
