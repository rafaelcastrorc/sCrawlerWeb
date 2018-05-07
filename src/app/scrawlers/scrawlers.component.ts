import {Component, OnInit} from '@angular/core';
import {Scrawler} from "../models/scrawler";
import {AuthService} from "../services/auth.service";
import {DashboardService} from "../services/dashboard.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-scrawlers',
  templateUrl: './scrawlers.component.html',
  styleUrls: ['./scrawlers.component.css'],
})
export class ScrawlersComponent implements OnInit {
  instances = Array<Scrawler>();
  proxies = Array<{ ip: string, port: number, updated: string }>();
  numberOfInstances: number;
  date: string;

  constructor(private dashboard: DashboardService, private router: Router) {
    //Force to reload when changing to children components
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
    //Get data from server
    this.obtainDataFromServer();
    //Update data every minute
    setInterval(() => {
      this.obtainDataFromServer()
    }, 1000 * 60);
    //

  }

  /**
   * Gets all the data associated to this user from the server
   */
  obtainDataFromServer() {
    //Update everything
    this.proxies = Array<{ ip: string, port: number, updated: string }>();

    this.dashboard.getAllProxies().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        let proxy = {'ip': data[i].ip, 'port': data[i].port, 'updated': data[i].updated};
        this.proxies.push(proxy);
      }
      // Set the proxies in the dashboard service so that it notifies the children component
      this.dashboard.setProxies(this.proxies);

    });

    this.numberOfInstances = 0;
    //Get the number of instances globally
    this.dashboard.getAllInstancesGlobally().subscribe(data => {
        this.numberOfInstances = data.count;
        this.dashboard.setNumberOfInstancesGlobally(this.numberOfInstances);
      }
    );

    this.instances = Array<Scrawler>();
    //Get all the user instances
    this.dashboard.getMyInstances().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        this.instances.push(data[i]);
      }
      this.dashboard.setMyInstances(this.instances);
    });
    //Update the date the data was refreshed
    this.dashboard.getUpdatedDate().subscribe(data => {
      this.date = data.date;
      this.dashboard.setUpdateDate(this.date);
    });

  }

  ngOnInit() {
  }


}
