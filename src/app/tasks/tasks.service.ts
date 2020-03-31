/***********************************
; Title:  Task Service
; Author: Kurt Leadley
; Date:   15 March 2020
; Description: UI service for Angular to handle task data
***************************************************************/
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { Task } from "./task.model";
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({ providedIn: "root" })
export class TasksService {
  private tasks: Task[] = [];
  private tasksUpdated = new Subject<Task[]>();
  isAdmin: string;

  // we will need to construct this to use CRUD operations and router capabilities
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  // gets all tasks
  getTasks() {
    this.http
      .get<{ message: string; tasks: any }>("http://localhost:3000/api/tasks/alltasks")
      .pipe(
        map(taskData => {
          return taskData.tasks.map(task => {
            return {
              title: task.title,
              content: task.content,
              id: task._id,
              creator: task.creator,
              done: task.done
            };
          });
        })
      )
      .subscribe(transformedTasks => {
        this.tasks = transformedTasks;
        this.tasksUpdated.next([...this.tasks]);
      });
  }
 // get tasks for single employee
  getAllMyTasks(creator: string) {
    this.http
      .get<{ message: string; tasks: any }>("http://localhost:3000/api/tasks/mytasks/"+creator)
      .pipe(
        map(taskData => {
          return taskData.tasks.map(task => {
            return {
              title: task.title,
              content: task.content,
              id: task._id,
              creator: task.creator,
              done: task.done
            };
          });
        })
      )
      .subscribe(transformedTasks => {
        console.log(transformedTasks);
        this.tasks = transformedTasks;
        this.tasksUpdated.next([...this.tasks]);
      });
  }

  // get open tasks
  getMyOpenTasks(creator: string) {
    return this.http.get<{ message: string; tasks: any }>("http://localhost:3000/api/tasks/myopentasks/"+creator)
  }

  // get closed tasks
  getMyClosedTasks(creator: string) {
    return this.http.get<{ message: string; tasks: any }>("http://localhost:3000/api/tasks/myclosedtasks/"+creator);
  }

  // returns an observable for subscribed listeners. Section 2.28 from Udemy class
  getTaskUpdateListener() {
    return this.tasksUpdated.asObservable();
  }
  // get specific task with id passed in
  getTask(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      creator: string;
      done: boolean;
      }>(
      "http://localhost:3000/api/tasks/" + id
    );
  }

  // create a task
  addTask(title: string, content: string, creator: string, done: boolean) {
    const task: Task = { id: null, title: title, content: content, creator: creator,  done: done};
    this.http
      .post<{ message: string; taskId: string }>(
        "http://localhost:3000/api/tasks",
        task
      )
      .subscribe(responseData => {
        const id = responseData.taskId;
        task.id = id;
        this.tasks.push(task);
        this.tasksUpdated.next([...this.tasks]);
        // return to tasks
        this.router.navigate(["/mytasks/"+creator]);
      });
  }
  // update a task
  updateTask(id: string, title: string, content: string, creator: string, done: boolean ) {
    this.isAdmin = this.authService.getIsAdmin();
    const task: Task = { id: id, title: title, content: content, creator:creator, done: done };
    this.http
      .put("http://localhost:3000/api/tasks/" + id, task)
      .subscribe(response => {
        const updatedTasks = [...this.tasks];
        const oldTaskIndex = updatedTasks.findIndex(t => t.id === task.id);
        updatedTasks[oldTaskIndex] = task;
        this.tasks = updatedTasks;
        this.tasksUpdated.next([...this.tasks]);
        // return to my tasks if not admin
        if (this.isAdmin != "true") {
          this.router.navigate(["/mytasks/"+creator]);
        }
        // return to admin if admin (this is because admins can edit any tasks)
        if (this.isAdmin == "true" && this.router.url.startsWith('/edit')) {
          this.router.navigate(["/admin"]);
        }
        console.log("state changed");
        console.log(task);
      });
  }
 // delete a task
  deleteTask(taskId: string) {
    this.http
      .delete("http://localhost:3000/api/tasks/" + taskId)
      .subscribe(() => {
        const updatedTasks = this.tasks.filter(task => task.id !== taskId);
        this.tasks = updatedTasks;
        this.tasksUpdated.next([...this.tasks]);
      });
  }
}
