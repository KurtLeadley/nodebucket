/***********************************
; Title:  Signup Component
; Author: Kurt Leadley
; Date:   15 March 2020
; Description: This will create an employee
***************************************************************/
import { Component } from "@angular/core";
import { NgForm } from "@angular/forms"
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {
  isLoading : boolean = false;
  constructor(public authService: AuthService) {}
  onSignup(form: NgForm) {
    console.log(form.value);
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    // create an employee when submitting the form
    this.authService.createEmployee(form.value.eId, form.value.email, form.value.password, form.value.isAdmin);
  }
}
