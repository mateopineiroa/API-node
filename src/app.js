const fs = require("fs");
const path = require("path");
const express = require("express");
// const morgan = require("morgan"); // Used to log the http requests history
const mongooseEndpoints = require("../router/mongooseEndpoints");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("../router/htmlEndpoints");
const apiRoutes = require("../router/crudEndpoints");
const loginRoutes = require("../router/loginEndpoints");
const Message = require("../Schema/Message");

const http = require("http");
const { Server } = require("socket.io");

const uri = process.env.MONGODB_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
  },
});

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
app.use(cors());
app.get("/", (req, res) => {
  // console.log(req);
  res.status(200);
  res.send("dsad");
  // res.sendFile(__dirname + "/index.html");
});
// app.use(morgan("combined", { stream: accessLogStream })); // Setup the logger
app.use("/api", routes);
app.use("/user", loginRoutes);
app.use("/mongoose", mongooseEndpoints);
app.use("", apiRoutes); // IMPORTANT: Always place the empty string base path routes last in the routing order.

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    console.log("message: " + msg.message + ", From: " + msg.user);
  });
});

io.on("connection", (socket) => {
  socket.on("chat message", async ({ message, user }) => {
    try {
      const newMessage = { message, user, date: new Date() };
      const messageObject = new Message(newMessage);

      io.emit("chat message", newMessage);

      await messageObject.save();
    } catch (err) {
      console.log(err);
    }
  });
});

server.listen(3000, () => {
  console.log("Server is up in port 3000, http://localhost:3000");
});

module.exports = app;
