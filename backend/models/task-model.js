/***********************************
; Title:  Task Model
; Author: Kurt Leadley
; Date:   15 March 2020
; Description: Task model for employees
***************************************************************/
const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  creator: {type: String, required:true},
  // todo / done is stored as a boolean here
  done: {type: Boolean}
});
// export our task model for use
module.exports = mongoose.model('Task', taskSchema);
