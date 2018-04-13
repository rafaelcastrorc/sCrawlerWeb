import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DashboardService} from "../../services/dashboard.service";
import {Proxy} from "../../models/proxy";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";


@Component({
  selector: 'app-proxies',
  templateUrl: './proxies.component.html',
  styleUrls: ['./proxies.component.css']
})

export class ProxiesComponent implements OnInit, AfterViewInit {
  proxiesData = Array<Proxy>();
  displayedColumns = ['ip', 'port', 'updated'];
  dataSource = new MatTableDataSource<Proxy>(this.proxiesData);
  date: Date;

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private dashboard: DashboardService) {
    dashboard.proxies$.subscribe(proxies => {
      this.proxiesData = proxies;
      //Update the data
      this.dataSource.data = this.proxiesData;
    }

  );

  }

  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


  ngOnInit(): void {
    //Get current time
    this.date = new Date();


  }

}
