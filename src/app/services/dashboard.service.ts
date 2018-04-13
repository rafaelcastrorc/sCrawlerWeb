import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs/Subject";
import {Proxy} from "../models/proxy";

interface Instance {
  id: string;
  location: string;
}

interface NumberOfInstances {
  counter: number; l
}


interface InstancesArray extends Array<Instance>{}
interface ProxiesArray extends Array<Proxy>{}

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

  // Observable string sources
  private proxiesSource = new Subject<ProxiesArray>();
  private instancesSource= new Subject<InstancesArray>();
  private instancesGloballySource= new Subject<number>();

  // Observable string streams
  proxies$ = this.proxiesSource.asObservable();
  instances$ = this.instancesSource.asObservable();
  instancesGlobally$ = this.instancesGloballySource.asObservable();


  setProxies(proxies: ProxiesArray) {
    this.proxiesSource.next(proxies);
  }

  setInstances(instances: InstancesArray) {
    this.instancesSource.next(instances);
  }
  setNumberOfInstancesGlobally(number: number) {
    this.instancesGloballySource.next(number);
  }

  /**
   * Retrieves all the instances that the user has
   */
  getAllInstances() {
    return this.http.get<InstancesArray>('/api_users/instances');
  }

  /**
   * Retrieves the number of instances available globally
   */
  getAllInstancesGlobally() {
    return this.http.get<NumberOfInstances>('/api_users/all_instances');
  }

  /**
   * Retrieves all the proxies currently available
   */
  getAllProxies() {
    return this.http.get<ProxiesArray>('/api_users/proxies');
  }



}
