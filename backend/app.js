/***********************************
; Title:  node js App
; Author: Kurt Leadley
; Date:   15 March 2020
; Description: imports dependencies, sets HTTP rules and connects to db
***************************************************************/
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

// these define the 2nd half of the api urls
const tasksRoutes = require("./routes/tasks");
const employeeRoutes = require("./routes/employees");

const app = express();

// connect to our database
mongoose
  // this is not a localhost mongodb instance, sign into mongoDB with bellevue account
  .connect(
     "mongodb+srv://kurt:"+process.env.MONGO_ATLAS_PW+"@buwebdev-cluster-1-klsvt.mongodb.net/nodebucket"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", express.static(path.join(__dirname, "angular")));

// allow these http headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  // allow for these HTTP methods
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// define the base url for our api requests
app.use("/api/tasks", tasksRoutes);
app.use("/api/employees", employeeRoutes);
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});

module.exports = app;
