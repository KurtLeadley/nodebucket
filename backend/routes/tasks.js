/***********************************
; Title:  Task API
; Author: Kurt Leadley
; Date:   15 March 2020
; Description: CRUD Router for Task HTTP requests
***************************************************************/
const express = require("express");
const router = express.Router();

const TaskController = require("../controllers/tasks-controller");

// import our Task model and checkAuth class

const checkAuth = require("../middleware/check-auth");

// CRUD Routes
// create task
router.post("",checkAuth, TaskController.createTask);

// edit task
router.put("/:id", checkAuth, TaskController.editTask);

// delete certain post
router.delete("/:id", checkAuth, TaskController.deleteTask);

// get all tasks
router.get("/alltasks", TaskController.getAllTasks);

// get open tasks
router.get("/opentasks", TaskController.getOpenTasks);

// get closed tasks
router.get("/closedtasks", TaskController.getClosedTasks);

// get all tasks for employee by id
router.get("/mytasks/:eid", TaskController.getAllEmployeeTasks );

// get open tasks for employee by id
router.get("/myopentasks/:eid", TaskController.getAllOpenEmployeeTasks);

// get closed tasks for employee by id
router.get("/myclosedtasks/:eid", TaskController.getAllClosedEmployeeTasks);

// get task by id
router.get("/:id", TaskController.getTaskById);

// export this
module.exports = router;
