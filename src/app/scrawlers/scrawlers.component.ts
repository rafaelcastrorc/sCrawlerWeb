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
  proxies = Array<{ip:string, port:number, updated:string}>();
  numberOfInstances: number;

  constructor(private dashboard: DashboardService, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };

  }

  ngOnInit() {
    //Get all the proxies
    this.dashboard.getAllProxies().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        let proxy = {'ip':data[i].ip, 'port': data[i].port, 'updated':data[i].updated};
        this.proxies.push(proxy);
      }
      // Set the proxies in the dashboard service so that it notifies the children component
      this.dashboard.setProxies(this.proxies);

    });

    //Get the number of instances globally
    this.dashboard.getAllInstancesGlobally().subscribe(data => {
      this.numberOfInstances = data.counter;
      this.dashboard.setNumberOfInstancesGlobally(this.numberOfInstances);
      }
    );

    //Get all the user instances
    this.dashboard.getAllInstances().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        this.instances.push(data[i]);
      }
      this.dashboard.setInstances(this.instances);

    });
    //
  }



}
