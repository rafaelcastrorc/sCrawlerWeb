import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Scrawler} from "../../scrawler";

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.css'],
  inputs: ['scrawler']
})
export class VisualizerComponent implements OnInit {
  scrawlers: Scrawler[];

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

}
