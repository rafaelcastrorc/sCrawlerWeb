import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import 'rxjs/add/observable/of';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

interface isLoggedIn {
  status: boolean
}

/**
 * Interface used for incoming messages from login or register post request
 */
interface IncomingMessage {
  message: string
  firstName: string
  lastName: string

}

interface LogoutStatus {
  success: boolean
}

@Injectable()
export class AuthService {
  private _observableStatus = new EventEmitter;
  private loggedInStatus = false;
  private userFirstNameSource = new BehaviorSubject<string>("");
  private userLastNameSource = new BehaviorSubject<string>("");
  userFirstNameObservable$ = this.userFirstNameSource.asObservable();
  userLastNameObservable$ = this.userLastNameSource.asObservable();

  constructor(private http: HttpClient) {
  }

  get isLoggedIn() {
    return this.loggedInStatus;
  }

  get observableStatus(): EventEmitter<any> {
    return this._observableStatus;
  }

  setUserName(firstName: string, lastName: string) {
    this.userFirstNameSource.next(firstName);
    this.userLastNameSource.next(lastName);
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
    this.loggedInStatus = value;
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
