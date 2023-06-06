const fs = require("fs");
const path = require("path");
const express = require("express");
const morgan = require("morgan"); // Used to log the http requests history

require("dotenv").config();
const routes = require("../router/htmlEndpoints");
const apiRoutes = require("../router/crudEndpoints");

const app = express(); //express() initializes the app and you configure it with it's methods

console.log(process.env.API_KEY);

// // Define paths for Express config
const publicDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");

// Create a write stream (In append mode)?
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "../access.log"),
  { flags: "a" }
);

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);

// Setup static directory to serve
app.use(express.static(publicDirPath));
app.use(express.json()); // Middleware for parsing JSON data. It needs to be added to parse the body before reaching the endpoints
// Setup the logger
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/api", routes);
app.use("", apiRoutes);

app.listen(3000, () => {
  console.log("Server is up in port 3000, http://localhost:3000");
});

module.exports = app;
