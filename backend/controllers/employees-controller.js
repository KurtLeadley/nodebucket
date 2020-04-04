/***********************************
; Title:  Employee API
; Author: Kurt Leadley
; Date:   31 March 2020
; Description: CRUD Controller for Task HTTP requests
***************************************************************/

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/employee-model');

// create employee controller
exports.createEmployee = (req, res, next) => {
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
}

// login controller
exports.employeeLogin =  (req, res, next) => {
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
    // create an auth token for 2 hours
    const token = jwt.sign(
      {email: fetchedEmployee.email, eId: fetchedEmployee.eId},
      process.env.JWT_KEY,
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
}

// get employee by id controller
exports.getEmployeeById = (req, res, next) => {
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
}

// get all employees controller
exports.getAllEmployees = (req, res, next) => {
  Employee.find().then(documents => {
    res.status(200).json({
      message: "Employees fetched successfully!",
      employees: documents
    });
  });
}
