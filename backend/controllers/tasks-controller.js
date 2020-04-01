/***********************************
; Title:  Task API
; Author: Kurt Leadley
; Date:   31 March 2020
; Description: CRUD Controller for Task HTTP requests
***************************************************************/
const Task = require("../models/task-model");

exports.createTask = (req, res, next) => {
  // use the Task model
  const task = new Task({
    title: req.body.title,
    content: req.body.content,
    creator: req.employeeData.eId,
    done: false
  });
  console.log(req.employeeData);
  task.save().then(createdTask => {
    res.status(201).json({
      message: "Task added successfully",
      taskId: createdTask._id
    });
  });
}

exports.editTask = (req, res, next) => {
  const task = new Task({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    creator: req.body.creator,
    done : req.body.done
  });
  // find that certain task in mongoDB and update it
  Task.updateOne({ _id: req.params.id }, task).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(401).json({ message: "Not authorized"});
    }
  });
}

exports.getAllTasks = (req, res, next) => {
  Task.find().then(documents => {
    res.status(200).json({
      message: "Tasks fetched successfully!",
      tasks: documents
    });
  });
}

exports.deleteTask = (req, res, next) => {
  Task.deleteOne({ _id: req.params.id}).then(
    result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Delete successful!" });
      } else {
        res.status(401).json({ message: "Not authorized"});
      }
  });
}

exports.getOpenTasks = (req, res, next) => {
  Task.find({"done": false}).then(documents => {
    res.status(200).json({
      message: "Open Tasks fetched successfully!",
      tasks: documents
    });
  });
}

exports.getClosedTasks =  (req, res, next) => {
  Task.find({"done": true}).then(documents => {
    res.status(200).json({
      message: "Closed Tasks fetched successfully!",
      tasks: documents
    });
  });
}

exports.getAllEmployeeTasks = (req, res, next) => {
  console.log(req.params);
  Task.find({creator:req.params.eid}).then(documents => {
    if (documents) {
      res.status(200).json({
        message: "All Tasks for Employee Successfully Found",
        tasks: documents
      });
    } else {
      res.status(404).json({ message: "Tasks not found!" });
    }
  });
}

exports.getAllOpenEmployeeTasks = (req, res, next) => {
  console.log(req.params);
  Task.find({creator:req.params.eid, done: false}).then(documents => {
    if (documents) {
      res.status(200).json({
        message: "Open Tasks for Employee Successfully Found",
        tasks: documents
      });
    } else {
      res.status(404).json({ message: "Tasks not found!" });
    }
  });
}

exports.getAllClosedEmployeeTasks = (req, res, next) => {
  console.log(req.params);
  Task.find({creator:req.params.eid, done: true}).then(documents => {
    if (documents) {
      res.status(200).json({
        message: "Closed Tasks for Employee Successfully Found",
        tasks: documents
      });
    } else {
      res.status(404).json({ message: "Tasks not found!" });
    }
  });
}

exports.getTaskById = (req, res, next) => {
  Task.findById(req.params.id).then(task => {
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: "Task not found!" });
    }
  });
}
