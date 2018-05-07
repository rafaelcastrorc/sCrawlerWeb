import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DashboardService} from "../../services/dashboard.service";
import {Proxy} from "../../models/proxy";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {Router} from "@angular/router";


@Component({
  selector: 'app-proxies',
  templateUrl: './proxies.component.html',
  styleUrls: ['./proxies.component.css']
})

export class ProxiesComponent implements OnInit, AfterViewInit {

  proxiesData = Array<Proxy>();
  displayedColumns = ['ip', 'port', 'updated'];
  dataSource = new MatTableDataSource<Proxy>(this.proxiesData);
  date: string;

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private router: Router, private dashboard: DashboardService) {
    dashboard.proxies$.subscribe(proxies => {
      this.proxiesData = proxies;
      //Update the data
      this.dataSource.data = this.proxiesData;
    }
  );
    //Get the date info was updated
    dashboard.date$.subscribe(date => {
      this.date = date;
    });


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

  }

}
