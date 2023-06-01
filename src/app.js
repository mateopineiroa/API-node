const path = require("path");
const express = require("express");
const weather = require("./utils/weather");
const latLong = require("./utils/latLong");
const { MongoClient, ServerApiVersion } = require("mongodb");
const {
  // writeOperation,
  readOperation,
  updateOperation,
  deleteOperation,
} = require("./utils/CRUD");
const routes = require("../router/htmlEndpoints");
const apiRoutes = require("../router/crudEndpoints");

const app = express(); //express() initializes the app and you configure it with it's methods

// // Define paths for Express config
const publicDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");

const testObject = {
  // _id: new ObjectId("64765f371770e62514ca9a59"),
  name: "Test write operation",
};

// writeOperation(testObject);
// readOperation(testObject);
// updateOperation(testObject, { name: "new fields" });
// deleteOperation(testObject);
// readOperation({ name: "new field" });
// queryMongo().catch(console.dir);

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);

// // Setup static directory to serve
app.use(express.static(publicDirPath));
app.use(express.json()); // Middleware for parsing JSON data. It needs to be added to parse the body before reaching the endpoints
app.use("/api", routes);
app.use("", apiRoutes);

app.listen(3000, () => {
  console.log("Server is up in port 3000, http://localhost:3000");
});

module.exports = app;
