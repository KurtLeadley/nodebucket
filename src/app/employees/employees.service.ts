/***********************************
; Title:  Employees Service
; Author: Kurt Leadley
; Date:   22 March 2020
; Description: UI service for Angular to handle employee data
***************************************************************/
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs"

@Injectable({ providedIn: "root" })

export class EmployeeService {
  // use http client as http
  constructor(private http: HttpClient) {}
  // get our employees with get
  getEmployees(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/api/employees');
  }
}
