import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import 'rxjs/add/observable/of';

interface isLoggedIn {
  status: boolean
}

interface IncomingMessage {
  message: string
}
@Injectable()
export class AuthService {


  private loggedInStatus =  false;


  constructor(private http: HttpClient) {
  }

  //Logs in the user
  loginUser(email: string, password: string) {
    return this.http.post('/api_users/login', {
      email,
      password
    }).subscribe(data => {
      console.log(data, 'data returned from server');
    })

  }


  /**
   * Registers the user
   * @param {string} firstname
   * @param {string} lastname
   * @param {string} email
   * @param {string} password
   * @returns {Observable<IncomingMessage>}
   */
  registerUser(firstname: string, lastname: string, email: string, password: string) {
    return this.http.post<IncomingMessage>('/api_users/register', {
      firstname,
      lastname,
      email,
      password
    })
  }

  /**
   * Sets the current login status of the user
   * @param {boolean} value
   */
  setLoggedIn(value: boolean) {
    this.loggedInStatus =value;
  }


  get isLoggedIn() {
    return this.loggedInStatus;
  }

  /**
   * Access server to check if user is actually logged in
   */
  verifyLoggingStatus(): Observable<isLoggedIn> {
    return this.http.get<isLoggedIn>('/api_users/getauth');
  }

  /**
   * Access server to check if user is actually logged in
   */
  verifyLoggingStatus2() {
    return this.http.get<isLoggedIn>('/api_users/getauth');
  }

}
