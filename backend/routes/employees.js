/***********************************
; Title:  Employee API
; Author: Kurt Leadley
; Date:   15 March 2020
; Description: CRUD Routes for Employee HTTP requests
***************************************************************/
// import node dependencies and employee model
const express = require('express');

const EmployeeController = require("../controllers/employees-controller");

const router = express.Router();

// create employee
router.post("/signup", EmployeeController.createEmployee);

// login
router.post("/login", EmployeeController.employeeLogin);

// get all employees
router.get("", EmployeeController.getAllEmployees );

// get employee by id
router.get("/:eId", EmployeeController.getEmployeeById );

// export this to router
module.exports = router;
