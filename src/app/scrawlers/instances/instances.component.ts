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
  date: string;
  operationsPerformed = Array<{ 'id': any, 'operation': any, 'message': any }>();


  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private dashboard: DashboardService) {
    dashboard.myInstances$.subscribe(instances => {
        this.scrawlersData = instances;
        this.dataSource.data = this.scrawlersData;
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

  onSelect(id, operation) {
    let found = false;
    let index = 0;
    //Check if user has already performed an operation, if so, update it
    for (let i = 0; i < this.operationsPerformed.length; i++) {
      if (this.operationsPerformed[i].id == id) {
        this.operationsPerformed[i] = {id: id, operation: operation, message: 'Loading...'};
        index = i;
        found = true
      }
    }
    if (!found) {
      this.operationsPerformed.push({id: id, operation: operation, message: 'Loading...'});
      index = this.operationsPerformed.length - 1;
    }
    this.dashboard.performOperation(id, operation).subscribe(data => {
        //Update the message based on the server response
      console.log(data);
        if (data.success) {
          this.operationsPerformed[index].message = 'Successfully sent operation ' + operation + ' to server.'
        } else {
          this.operationsPerformed[index].message = 'Operation ' + operation + ' was not successful.'
        }
      }
    );

  }

  getMessage(id) {
    for (let i = 0; i < this.operationsPerformed.length; i++) {
      if (this.operationsPerformed[i].id == id) {
        return this.operationsPerformed[i].message;
      }
    }
    return 'none';
  }
}
