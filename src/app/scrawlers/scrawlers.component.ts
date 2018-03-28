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
  queries: String[] = [
    "Show me all active sCrawlers", "Show me a given sCrawler"];

  constructor(private auth: AuthService) {

  }

  ngOnInit() {
    // this.auth.verifyLoggingStatus();
  }

  onSelectQuery(query: String) {
    this.selectedQuery = query;
    console.log(this.selectedQuery);
  }


}
