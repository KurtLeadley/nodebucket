/***********************************
; Title:  Task API
; Author: Kurt Leadley
; Date:   15 March 2020
; Description: CRUD Operations for Task HTTP requests
***************************************************************/
const express = require("express");
const router = express.Router();

// import our Task model and checkAuth class
const Task = require("../models/task-model");
const checkAuth = require("../middleware/check-auth");

// CRUD OPERATIONS
// create task
router.post("",
  checkAuth,
  (req, res, next) => {
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
});

// edit task
router.put("/:id",
  checkAuth,
  (req, res, next) => {
    const task = new Task({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      creator: req.body.creator,
      done : req.body.done
    });
    // find that certain task in mongoDB and update it
    Task.updateOne({ _id: req.params.id }, task).then(result => {
      if (result.nModified > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized"});
      }
    });
});

// display all tasks
router.get("/alltasks", (req, res, next) => {
  Task.find().then(documents => {
    res.status(200).json({
      message: "Tasks fetched successfully!",
      tasks: documents
    });
  });
});

// get open tasks
router.get("/opentasks", (req, res, next) => {
  Task.find({"done": false}).then(documents => {
    res.status(200).json({
      message: "Open Tasks fetched successfully!",
      tasks: documents
    });
  });
});

// get closed tasks
router.get("/closedtasks", (req, res, next) => {
  Task.find({"done": true}).then(documents => {
    res.status(200).json({
      message: "Closed Tasks fetched successfully!",
      tasks: documents
    });
  });
});


// display all tasks for employee by id
router.get("/mytasks/:eid", (req, res, next) => {
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
});

// display open tasks for employee by id
router.get("/myopentasks/:eid", (req, res, next) => {
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
});

// display closed tasks for employee by id
router.get("/myclosedtasks/:eid", (req, res, next) => {
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
});

// display task to edit
router.get("/:id", (req, res, next) => {
  Task.findById(req.params.id).then(task => {
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: "Task not found!" });
    }
  });
});


// delete certain post
router.delete("/:id", checkAuth, (req, res, next) => {
  Task.deleteOne({ _id: req.params.id}).then(
    result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Delete successful!" });
      } else {
        res.status(401).json({ message: "Not authorized"});
      }
  });
});

// this function was created to prevent the creator from being overwritten by admin edits
// it is used above in the put method
// function getCreatorByTaskId(id) {
//   router.get("/:id", (req, res, next) => {
//     Task.findById(id).then(task => {
//       if (task) {
//         console.log("hello");
//         res.status(200).json({message:task.creator});
//         return task.creator;
//       } else {
//         res.status(404).json({ message: "Task not found!" });
//       }
//     });
//   });
// }

// export this
module.exports = router;
