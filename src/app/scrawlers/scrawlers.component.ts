import { Component, OnInit } from '@angular/core';
import {Scrawler} from "../scrawler";

@Component({
  selector: 'app-scrawlers',
  templateUrl: './scrawlers.component.html',
  styleUrls: ['./scrawlers.component.css'],
})
export class ScrawlersComponent implements OnInit {
  selectedQuery:String;
  queries: String[] = [
    "Show me all active sCrawlers","Show me a given sCrawler"];
  constructor() { }

  ngOnInit() {

  }

  onSelectQuery(query:String) {
    this.selectedQuery = query;
    console.log(this.selectedQuery);
  }


}
