const fs = require("fs");
const path = require("path");
const express = require("express");
// const morgan = require("morgan"); // Used to log the http requests history
const mongooseEndpoints = require("../router/mongooseEndpoints");
require("dotenv").config();
const mongoose = require("mongoose");

const routes = require("../router/htmlEndpoints");
const apiRoutes = require("../router/crudEndpoints");
const loginRoutes = require("../router/loginEndpoints");

const uri = process.env.MONGODB_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express(); //express() initializes the app and you configure it with it's methods

// // Define paths for Express config
const publicDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");

// Create a write stream (In append mode)?
// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "../access.log"),
//   { flags: "a" }
// );

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);

app.use(express.static(publicDirPath)); // Setup static directory to serve
app.use(express.json()); // Middleware for parsing JSON data. It needs to be added to parse the body before reaching the endpoints

// app.use(morgan("combined", { stream: accessLogStream })); // Setup the logger
app.use("/api", routes);
app.use("/user", loginRoutes);
app.use("/mongoose", mongooseEndpoints);
app.use("", apiRoutes); // IMPORTANT: Always place the empty string base path routes last in the routing order.

app.listen(3000, () => {
  console.log("Server is up in port 3000, http://localhost:3000");
});

module.exports = app;
