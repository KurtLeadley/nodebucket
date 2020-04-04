/***********************************
; Title:  Task Create Controller
; Author: Kurt Leadley
; Date:   15 March 2020
; Description: Logic for creating tasks
***************************************************************/
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";

import { TasksService } from "../tasks.service";
import { Task } from "../task.model";

@Component({
  selector: "app-post-create",
  templateUrl: "./task-create.component.html",
  styleUrls: ["./task-create.component.css"]
})
export class TaskCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  task: Task;
  form: FormGroup;
  isAdmin: string;
  private mode = "create";
  private taskId: string;

  constructor(
    public tasksService: TasksService,
    public route: ActivatedRoute,
    public router : Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content : new FormControl(null, {
        validators: [Validators.required]
      }),
      creator : new FormControl(null),
      // set initial value of done to false
      done : new FormControl(false)
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("taskId")) {
        this.mode = "edit";
        this.taskId = paramMap.get("taskId");
        this.tasksService.getTask(this.taskId).subscribe(taskData => {
          this.task = {
            id: taskData._id,
            title: taskData.title,
            content: taskData.content,
            creator: taskData.creator,
            done: taskData.done
          };
          console.log(this.task);
          // load values when viewing a task
          this.form.setValue({
            title : this.task.title,
            content : this.task.content,
            creator: this.task.creator,
            done: this.task.done
          });
        });
      } else {
        this.mode = "create";
        this.taskId = null;
      }
    });
  }

  onSaveTask() {
    if (this.form.invalid) {
      return;
    }
    // create or update task, based on mode
    if (this.mode === "create") {
      this.tasksService.addTask(this.form.value.title, this.form.value.content, this.form.value.creator, this.form.value.done);
    } else {
      this.tasksService.updateTask(
        this.taskId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.creator,
        this.form.value.done
      );
    }
    this.form.reset();
  }
}
