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
    const eId = Math.floor(1000 + Math.random() * 90000000).toString();
    // create an employee when submitting the form
    this.authService.createEmployee(eId, form.value.email, form.value.password, form.value.isAdmin);
  }
}
