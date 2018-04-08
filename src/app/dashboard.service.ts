import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

interface Instance {
  id: string; location: string;
}

interface InstancesArray extends Array<Instance>{}

/**
 * Handles all request to the server from the user dashboard
 */
@Injectable()
export class DashboardService {

  constructor(private http: HttpClient) { }

  // /**
  //  * Logs the user in
  //  * @param username
  //  * @param {string} password
  //  * @returns {Subscription}
  //  */
  // loginUser(username: string, password: string) {
  //   return this.http.post<IncomingMessage>('/api_users/login', {
  //     username,
  //     password
  //   })
  // }
  //
  //
  // /**
  //  * Registers the user
  //  * @param {string} firstname
  //  * @param {string} lastname
  //  * @param {string} email
  //  * @param {string} password
  //  * @returns {Observable<IncomingMessage>}
  //  */
  // registerUser(firstname: string, lastname: string, email: string, password: string) {
  //   return this.http.post<IncomingMessage>('/api_users/register', {
  //     firstname,
  //     lastname,
  //     email,
  //     password
  //   })
  // }


  /**
   * Retrieves all the instances that the user has
   */
  getAllInstances() {
    return this.http.get<InstancesArray>('/api_users/instances');
  }



}
