/***********************************
; Title:  Employee API
; Author: Kurt Leadley
; Date:   15 March 2020
; Description: CRUD Operations for Employee HTTP requests
***************************************************************/
// import node dependencies and employee model
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Employee = require('../models/employee-model');

const router = express.Router();
// sign up request
router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then (hash => {
      const employee = new Employee({
        eId: req.body.eId,
        email: req.body.email,
        password: hash,
        isAdmin: false
      });
      // if it is still working.....
      employee.save()
        .then(result => {
          res.status(201).json({
            message: "Employee Created",
            result: result
          });
        })
        // or else...
        .catch(err => {
          res.status(500).json({
            error:err
          })
        });
    });
});
// general api request for employees
router.get("", (req, res, next) => {
  Employee.find().then(documents => {
    res.status(200).json({
      message: "Employees fetched successfully!",
      employees: documents
    });
  });
});
// general api request for specific employee
router.get("/:eId", (req, res, next) => {
  Employee.findById(req.params.eId).then(employee => {
    if (employee) {
      res.status(200).json({
        message: "Employee fetched successfully!",
        employee: employee
      });
    } else {
      res.status(404).json({ message: "employee not found!" });
    }
  });
});

// http post attempt for logging in
router.post("/login", (req, res, next) => {
  let fetchedEmployee;
  Employee.findOne({ email: req.body.email })
  .then(employee=> {
    console.log(employee);
    if (!employee) {
      return res.status(401).json({
        message: "auth failed"
      });
    }
    fetchedEmployee = employee;
    // compare hashed passwords
    return bcrypt.compare(req.body.password, employee.password);
  })
  .then( result => {
    console.log(result);
    if(!result) {
      return res.status(401).json({
        message: "auth failed"
      });
    }
    const token = jwt.sign(
      {email: fetchedEmployee.email, eId: fetchedEmployee.eId},
      'secret_this_should_be_longer',
      {expiresIn: '2h'}
    );
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      eId: fetchedEmployee.eId,
      email: fetchedEmployee.email,
      isAdmin: fetchedEmployee.isAdmin
    });
  })
  .catch(err => {
    console.log(err);
    return res.status(401).json({
      message: "auth failed"
    });
  });
});
// export this to router
module.exports = router;
