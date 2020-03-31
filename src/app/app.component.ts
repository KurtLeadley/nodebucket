/***********************************
; Title:  App Component
; Author: Kurt Leadley
; Date:   15 March 2020
; Description: Main Component, where everything else resides
***************************************************************/
import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // check the auth service always
    this.authService.autoAuthEmployee();
  }

}
