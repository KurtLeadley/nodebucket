import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";


@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  route: string;
  pageName: string;
  constructor(location: Location, router: Router) {
    router.events.subscribe(val => {
      if (location.path() != "") {
        this.route = location.path();
        this.pageName = this.route.toString().substring(1);
        this.pageName = this.pageName.charAt(0).toUpperCase() + this.pageName.slice(1);
        this.pageName = this.pageName.split("/")[0];
      } else {
        this.pageName = "Welcome";
      }
    });
  }

  ngOnInit() {}

}

