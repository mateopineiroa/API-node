const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../Schema/User");

const mongooseEndpoints = express.Router();

/* Should stores the password as a hash salted */
mongooseEndpoints.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = new User({ username, password });

    await user.save();

    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating user" });
  }
});

mongooseEndpoints.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid username (Invalid username or password)" });

    const passwordMatch = await bcrypt.compare(password, user.password); // I compare the two salted hashes

    if (!passwordMatch)
      return res
        .status(400)
        .json({ message: "Invalid password (Invalid username or password)" });

    const tokenData = { username };

    const token = jwt.sign(tokenData, process.env.PRIVATE_KEY, {
      expiresIn: "1h",
    });

    res.json({ message: "Logged in successfully", token });
  } catch (error) {
    console.log(error);
    res.send("Error in login endpoint");
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // header also can contain the alghorithm used to create the token
  // console.log({ authHeader }); Bearer <encrypted_token>

  if (token == null) return res.sendStatus(401);

  const decoded = jwt.verify(token, process.env.PRIVATE_KEY, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
  console.log(decoded);
}

mongooseEndpoints.post("/addItem", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  const item = req.body;

  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);

    const user = await User.findOne({ username: decoded.username });

    if (!user.items) user.items = [];

    user.items.push({ ...item, dateAcquired: new Date() });

    await user.save();

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid token" });
  }
});

mongooseEndpoints.get("/items", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);

    const user = await User.findOne({ username: decoded.username });

    res.json({ items: user.items });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = mongooseEndpoints;
