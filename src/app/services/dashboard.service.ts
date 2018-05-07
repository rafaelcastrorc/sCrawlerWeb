import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs/Subject";
import {Proxy} from "../models/proxy";
import {Scrawler} from "../models/scrawler";

interface NumberOfInstances {
  count: number;
}

interface UpdatedDate{
  date: string;
}
interface InstancesArray extends Array<Scrawler>{}
interface ProxiesArray extends Array<Proxy>{}


/**
 * Interface used for incoming messages after the user performs an operation
 */
interface OperationMessage {
  message: string
  success: boolean
}

/**
 * Handles all request to the server from the user dashboard
 */
@Injectable()
export class DashboardService {

  constructor(private http: HttpClient) { }

  // Observable string sources
  private proxiesSource = new Subject<ProxiesArray>();
  private myInstancesSource= new Subject<InstancesArray>();
  private instancesGloballySource= new Subject<number>();
  private updateDateSource= new Subject<string>();


  // Observable string streams
  proxies$ = this.proxiesSource.asObservable();
  myInstances$ = this.myInstancesSource.asObservable();
  instancesGlobally$ = this.instancesGloballySource.asObservable();
  date$ = this.updateDateSource.asObservable();


  setProxies(proxies: ProxiesArray) {
    this.proxiesSource.next(proxies);
  }

  setMyInstances(instances: InstancesArray) {
    this.myInstancesSource.next(instances);
  }
  setNumberOfInstancesGlobally(number: number) {
    this.instancesGloballySource.next(number);
  }

  setUpdateDate(date: string) {
    this.updateDateSource.next(date);

  }
  /**
   * Retrieves all the instances that the user has
   */
  getMyInstances() {
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


  /**
   * Retrieves all the proxies currently available
   */
  getUpdatedDate() {
    return this.http.get<UpdatedDate>('/api_users/date');
  }


  /**
   * Performs an operation in instance
   * @param id
   * @param operation
   */
  performOperation(id: any, operation: any) {
      return this.http.post<OperationMessage>('/api_users/perform_operation', {
        id,
        operation,
      })
    }
}
