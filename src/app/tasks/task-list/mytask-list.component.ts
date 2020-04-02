/***********************************
; Title:  List MyTasks
; Author: Kurt Leadley
; Date:   22 March 2020
; Description: This will list tasks for logged in employee
***************************************************************/
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, forkJoin } from 'rxjs';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import { Task } from "../task.model";
import { TasksService } from "../tasks.service";
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from "@angular/router";

@Component({
  selector: "app-mytask-list",
  templateUrl: "./mytask-list.component.html"
})
export class MyTaskListComponent implements OnInit, OnDestroy {
  // will be using these in this class
  allTasks: Task[] = [];
  openTasks: Task[] = [];
  closedTasks: Task[] = [];
  employeeIsAuthenticated = false;
  eId: string;
  email: string;
  isAdmin: string;
  showHeader = false;

  // send these back in put request
  id: string;
  title: string;
  content: string;
  creator: string;
  done: boolean;

  private tasksSub: Subscription;
  private authStatusSub : Subscription;

  constructor(public tasksService: TasksService, private authService: AuthService, public router: Router) {}

  ngOnInit() {
    // we need to get the email and employee id for display purposes
    this.eId = this.authService.getEmployeeId();
    this.email = this.authService.getEmployeeEmail();
    this.isAdmin = this.authService.getIsAdmin();
    // call getMyTasks from tasks.service.ts to get logged in employees tasks
    // console.log(this.router.url);
    // ignore OnInit if we are on the admin page, not /mytasks
    if (this.router.url.startsWith("/mytasks")) {
      this.tasksSub = forkJoin(
        this.tasksService.getMyOpenTasks(this.eId),
        this.tasksService.getMyClosedTasks(this.eId)
      ).subscribe((res) => {
          this.openTasks = res[0].tasks;
          this.closedTasks = res[1].tasks;
          console.log(this.openTasks);
        });
      this.showHeader = true;
    }

    if (this.router.url.startsWith("/admin")) {
      this.tasksService.getAllMyTasks(this.eId);
      this.tasksSub = this.tasksService.getTaskUpdateListener()
      .subscribe((allTasks: Task[]) => {
        this.allTasks = allTasks;
      });
    }

      this.employeeIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService
        .getAuthStatusListener()
        .subscribe( isAuthenticated => {
          this.employeeIsAuthenticated = isAuthenticated;
          this.eId = this.authService.getEmployeeId();
          this.isAdmin = this.authService.getIsAdmin();
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
          this.id = event.item.element.nativeElement.id;
          this.title = event.container.data[event.currentIndex]["title"];
          this.content = event.container.data[event.currentIndex]["content"];
          this.tasksService.getTask(this.id).subscribe(data => this.creator = data.creator);
          this.done = true;
          this.tasksService.updateTask(this.id, this.title, this.content, this.creator, this.done);
        }
        if (event.container.id == "todoList") {
          this.id = event.item.element.nativeElement.id;
          this.title = event.container.data[event.currentIndex]["title"];
          this.content = event.container.data[event.currentIndex]["content"];
          this.tasksService.getTask(this.id).subscribe(data => this.creator = data.creator);
          this.done = false;
          this.tasksService.updateTask(this.id, this.title, this.content, this.creator, this.done);
        }
    }
  }

  onDelete(taskId: string) {
    this.tasksService.deleteTask(taskId);
  }

  ngOnDestroy() {
    this.tasksSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
