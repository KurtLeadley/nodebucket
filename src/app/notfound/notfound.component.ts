/***********************************
; Title:  404 Component
; Author: Kurt Leadley
; Date:   26 March 2020
; Description: Custom 404 page
***************************************************************/
import { Component, OnInit } from '@angular/core';

// just show the not found page when going to a bad route
@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.css']
})
export class NotfoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
