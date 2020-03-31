/***********************************
; Title:  Admin Component
; Author: Kurt Leadley
; Date:   23 March 2020
; Description: Admin Component
***************************************************************/
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
// import {MatSelectModule} from '@angular/material/select';
import { Subscription, forkJoin } from 'rxjs';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import { Employee } from "../employees/employee.model";
import { Task } from "../tasks/task.model";
import { EmployeeService } from "../employees/employees.service";
import { TasksService } from "../tasks/tasks.service";
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  form: FormGroup;
  employees : Employee[] = [];
  allTasks: Task[] = [];
  openTasks: Task[] = [];
  closedTasks: Task[] = [];
  employeeIsAuthenticated = false;
  chosenEmployee: string;
  eId: string;
  email : string;
  isAdmin: string;
  selectedEmployee: string;

  taskId: string;
  title: string;
  content: string;
  creator: string;
  done: boolean;

  private tasksSub: Subscription;

  constructor(public employeeService: EmployeeService, private authService: AuthService, public tasksService: TasksService) {}

  ngOnInit() {

    this.tasksService.getTasks();
    this.tasksSub = this.tasksService.getTaskUpdateListener()
      .subscribe((allTasks: Task[]) => {
        this.allTasks = allTasks;
        //console.log(allTasks);
      });

    this.form = new FormGroup({
      employees: new FormControl(null)
    });
    this.eId = this.authService.getEmployeeId();
    this.employeeService.getEmployees().subscribe(response => {
      this.employees = response.employees;
      this.employees.push({"eId" : "All", "email" : "All", "password" : "All", "isAdmin" : "false"});
    });
  }

  // Choose employee using select dropdown
  changeEmployee() {
    //console.log("Employee Change:");
    this.chosenEmployee = this.selectedEmployee;
    //console.log(this.chosenEmployee);
    //this.tasksService.getAllMyTasks(this.chosenEmployee);
    this.tasksSub = forkJoin(
      this.tasksService.getMyOpenTasks(this.chosenEmployee),
      this.tasksService.getMyClosedTasks(this.chosenEmployee)
    ).subscribe((res) => {
        this.openTasks = res[0].tasks;
        this.closedTasks = res[1].tasks;
        //console.log(this.openTasks);
      });
  }

  // drag and drop to update task status
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
        transferArrayItem(event.previousContainer.data,
                          event.container.data,
                          event.previousIndex,
                          event.currentIndex);
        // get taskId of dragged element and send it back to the taskService method updateTask with true or false
        if (event.container.id == "doneList") {
          this.taskId = event.item.element.nativeElement.id;
          this.title = event.container.data[event.currentIndex]["title"];
          this.content = event.container.data[event.currentIndex]["content"];
          this.tasksService.getTask(this.taskId).subscribe(data => this.creator = data.creator);
          this.done = true;
          this.tasksService.updateTask(this.taskId, this.title, this.content, this.creator, this.done);
        }
        if (event.container.id == "todoList") {
          this.taskId = event.item.element.nativeElement.id;
          this.title = event.container.data[event.currentIndex]["title"];
          this.content = event.container.data[event.currentIndex]["content"];
          this.tasksService.getTask(this.taskId).subscribe(data => this.creator = data.creator);
          this.done = false;
          this.tasksService.updateTask(this.taskId, this.title, this.content, this.creator, this.done);
        }
    }
  }
  // when delete is clicked
  onDelete(taskId: string) {
    this.tasksService.deleteTask(taskId);
    location.reload();
  }
}
