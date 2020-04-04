/***********************************
; Title:  List Tasks
; Author: Kurt Leadley
; Date:   15 March 2020
; Description: This will list tasks on load
***************************************************************/
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

import { Task } from "../task.model";
import { TasksService } from "../tasks.service";
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: "app-task-list",
  templateUrl: "./task-list.component.html",
  styleUrls: ["./task-list.component.css"]
})
export class TaskListComponent implements OnInit, OnDestroy {

  constructor(public tasksService: TasksService, private authService: AuthService) {}
  allTasks: Task[] = [];
  public openTasks: any;
  public closedTasks: any;

  employeeIsAuthenticated = false;
  eId: string;
  isAdmin: string;

  private tasksSub: Subscription;
  private authStatusSub : Subscription;


  ngOnInit() {
    this.eId = this.authService.getEmployeeId();
    this.isAdmin = this.authService.getIsAdmin();

    // list all tasks on load
    this.tasksService.getTasks();
    this.tasksSub = this.tasksService.getTaskUpdateListener()
      .subscribe((allTasks: Task[]) => {
        this.allTasks = allTasks;
      });

    // auth sub
    this.employeeIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe( isAuthenticated => {
        this.employeeIsAuthenticated = isAuthenticated;
        this.eId = this.authService.getEmployeeId();
        this.isAdmin = this.authService.getIsAdmin();
      });
  }

  onDelete(taskId: string) {
    this.tasksService.deleteTask(taskId);
  }

  ngOnDestroy() {
    this.tasksSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
