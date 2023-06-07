const express = require("express");
const jwt = require("jsonwebtoken");

const loginRoutes = express.Router();

loginRoutes.get("", (req, res) => {
  res.send("/login works");
});

loginRoutes.post("/login", (req, res) => {
  // Authenticate user

  const user = {
    id: 1, // User ID
    name: "John Doe", // User name
  };

  const token = jwt.sign(
    user,
    "d770bc213d4902a0b1a24736d7c4322349b030ef0b5004f622ef4ff8ace93bec",
    { expiresIn: "1h" }
  ); // This token contains user id and name.

  res.json({
    token,
  });
});

module.exports = loginRoutes;
