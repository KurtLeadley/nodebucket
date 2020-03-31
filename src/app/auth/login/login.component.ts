/***********************************
; Title:  Login Component
; Author: Kurt Leadley
; Date:   15 March 2020
; Description: Logic for logging in
***************************************************************/
import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";

import { AuthService } from '../auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  constructor(public authService: AuthService) {}

  onLogin(form: NgForm) {
    console.log(form.value);
    if (form.invalid) {
      return;
    }
    // use auth service onLogin
    this.authService.login(form.value.eId, form.value.email, form.value.password, form.value.isAdmin);
  }
}
