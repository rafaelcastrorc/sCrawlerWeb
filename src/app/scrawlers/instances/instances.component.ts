import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {DashboardService} from "../../services/dashboard.service";
import {Scrawler} from "../../models/scrawler";

@Component({
  selector: 'app-instances',
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.css']
})
export class InstancesComponent implements OnInit, AfterViewInit {
  scrawlersData = Array<Scrawler>();
  displayedColumns = ['id', 'location', 'missing_papers', 'effectiveness_rate', 'download_rate', 'last_updated', 'started'];
  dataSource = new MatTableDataSource<Scrawler>(this.scrawlersData);
  date: Date;

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private dashboard: DashboardService) {
    dashboard.instances$.subscribe(instances => {
        this.scrawlersData = instances;
        //Update the data
        this.dataSource.data = this.scrawlersData;
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
