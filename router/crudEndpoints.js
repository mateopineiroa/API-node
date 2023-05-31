const express = require("express");
const apiRoutes = express.Router();
const {
  writeOperation,
  readOperation,
  updateOperation,
  deleteOperation,
} = require("../src/utils/CRUD");

apiRoutes.get("/", (req, res) => {
  res.send("The endpoint works");
});

apiRoutes.get("/read", (req, res) => {
  const params = req.query;
  console.log(params);
  res.send(params);
});

apiRoutes.get("/read/:id", (req, res) => {
  const userId = req.params.id;
  console.log(userId);

  res.send(userId);
});

apiRoutes.post("/write", (req, res) => {
  const object = req.body;
  console.log(object);

  res.json(object);
});

module.exports = apiRoutes;
