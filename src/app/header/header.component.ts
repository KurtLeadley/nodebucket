/***********************************
; Title:  Header Component
; Author: Kurt Leadley
; Date:   23 March 2020
; Description: Header Component
***************************************************************/
import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from '../auth/auth.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  employeeIsAuthenticated = false;
  eId : string;
  email: string;
  isAdmin: string;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.employeeIsAuthenticated = this.authService.getIsAuth();
    // for letting the header template access our employee id and email.
    this.eId = this.authService.getEmployeeId();
    this.email = this.authService.getEmployeeEmail();
    this.isAdmin = this.authService.getIsAdmin();
    // subscribe to auth data on initialization
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.employeeIsAuthenticated = isAuthenticated;
        // loads in users email immediately after login
        this.email = this.authService.getEmployeeEmail();
        this.eId = this.authService.getEmployeeId();
        this.isAdmin = this.authService.getIsAdmin();
      });
  }
  // clear out data on logout
  onLogout() {
    this.authService.logout();
    this.eId = null;
    this.email = null;
    this.isAdmin = null;
  }

  ngOnDestroy() {

  }
}
