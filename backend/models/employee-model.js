/***********************************
; Title:  Employee Model
; Author: Kurt Leadley
; Date:   15 March 2020
; Description: Data model for employees
***************************************************************/
const mongoose = require('mongoose');
// use this node library to enforce unique emails
const uniqueValidator = require('mongoose-unique-validator');
// schema requires unique id, unique email and some password
const employeeSchema = mongoose.Schema({
  eId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: String, required: true}
});
// enforce the email validator
employeeSchema.plugin(uniqueValidator);
// export model for use in other modules and components
module.exports = mongoose.model('Employee', employeeSchema);
