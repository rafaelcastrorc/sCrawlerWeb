import {Component, OnInit, style} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  myStyle: object = {};
  myParams: object = {};
  width: number = 100;
  height: number = 100;

  constructor() {
  }

  ngOnInit() {
    this.myStyle = {
      'position': 'fixed',
      'width': '100%',
      'height': '100%',
      'z-index': 99,
      'top': 0,
      'left': 0,
      'right': 0,
      'bottom': 0,
      'background-position': '50% 50%',
      'opacity':0.15

  };

    this.myParams = {
        particles: {
          number: {
            value: 150,
          },
          color: {
            value: '#6B6E70'
          },
        },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            "enable": true,
            "mode": "grab"
          },
          "onclick": {
            "enable": true,
            "mode": "bubble"
          }
        },
        "modes": {
          "bubble": {
            "distance": 800,
            "size": 5,
            "duration": 2,
            "opacity": 0.8,
            "speed": 3
          }
        }
      },
      };

  }


}
