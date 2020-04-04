/***********************************
; Title:  Banner Component
; Author: Kurt Leadley
; Date:   30 March 2020
; Description: banner component with dynamic page names
***************************************************************/
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
    // this is used for determining the route and then naming the page. Example : Admin
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

