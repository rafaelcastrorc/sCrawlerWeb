import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs/Observable";

interface isLoggedIn {
  status: boolean
}

interface IncomingMessage {
  message: string
}
@Injectable()
export class AuthService {


  private loggedInStatus = false;

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


  //Logs in the user
  registerUser(firstname: string, lastname: string, email: string, password: string) {
    return this.http.post<IncomingMessage>('/api_users/register', {
      firstname,
      lastname,
      email,
      password
    })
  }

  setLoggedIn(value: boolean) {
    this.loggedInStatus = value;
  }

  get isLoggedIn(): boolean {
    return this.loggedInStatus;
  }

  /**
   * Access server to check if user is actually logged in
   */
  verifyLoggingStatus(): Observable<isLoggedIn> {
    return this.http.get<isLoggedIn>('/api_users/getauth');
  }


}
