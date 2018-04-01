import {Component, OnInit} from '@angular/core';
import {Scrawler} from "../scrawler";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-scrawlers',
  templateUrl: './scrawlers.component.html',
  styleUrls: ['./scrawlers.component.css'],
})
export class ScrawlersComponent implements OnInit {
  message = "Loading...";

  selectedQuery: String;
  constructor() {

  }

  ngOnInit() {
  }

  onSelectQuery(query: String) {
    this.selectedQuery = query;
    console.log(this.selectedQuery);
  }


}
