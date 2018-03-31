import {EventEmitter, Injectable} from '@angular/core';
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

interface LogoutStatus {
  success: boolean
}
@Injectable()
export class AuthService {

  private _observableStatus = new EventEmitter;
  private loggedInStatus =  false;


  constructor(private http: HttpClient) {
  }

  /**
   * Logs the user in
   * @param username
   * @param {string} password
   * @returns {Subscription}
   */
  loginUser(username: string, password: string) {
    return this.http.post<IncomingMessage>('/api_users/login', {
      username,
      password
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
    this._observableStatus.emit(value);
    this.loggedInStatus =value;
  }


  get isLoggedIn() {
    return this.loggedInStatus;
  }

  get observableStatus(): EventEmitter<any> {
    return this._observableStatus;
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

  /**
   * Calls the server to log the user out
   *
   */
  logout() {
    return this.http.get<LogoutStatus>('/api_users/logout');
  }

}
