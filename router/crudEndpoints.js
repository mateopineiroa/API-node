const express = require("express");
const apiRoutes = express.Router();
const {
  writeOperation,
  readOperation,
  updateOperation,
  deleteOperation,
} = require("../src/utils/CRUD");
const { ObjectId } = require("mongodb");

apiRoutes.get("/", () => {
  res.send("The endpoint works :)");
});

apiRoutes.get("/query", async (req, res) => {
  const params = req.query; // Gets the variables on the url
  try {
    const objectFound = await readOperation(params);

    res.send(objectFound);
  } catch {
    res.send("Object not found");
  }
});

apiRoutes.get("/query/:id", async (req, res) => {
  const userId = req.params.id; // Gets the :id on the request url

  try {
    const objectFound = await readOperation({ _id: new ObjectId(userId) });

    res.send(objectFound);
  } catch {
    res.send("Object not found");
  }
});

apiRoutes.post("/write", async (req, res) => {
  const object = req.body; // gets the object from the request

  try {
    await writeOperation(object);

    res.json(object);
  } catch {
    res.send("Error getting the data");
  }
});

apiRoutes.post("/updateWithVars", async (req, res) => {
  const newObject = req.body; // gets the object from the request
  const uid = req.query;
  console.log(uid);

  try {
    const updated = await updateOperation(uid, newObject);

    if (updated.modifiedCount === 0) {
      res.send("The object already has that change");
    } else if (updated.acknowledged) {
      res.send("Object not found");
    } else {
      res.json(updated);
    }
  } catch {
    res.send("API error");
  }
});

apiRoutes.post("/updateWithId/:id", async (req, res) => {
  const newObject = req.body;
  const uid = req.params.id;

  try {
    const updated = await updateOperation(
      { _id: new ObjectId(uid) },
      newObject
    );

    if (updated.modifiedCount === 0) {
      res.send("The object already has that change");
    } else if (updated.acknowledged) {
      res.send("Object not found");
    } else {
      res.json(updated);
    }
  } catch (error) {
    res.send(error);
  }
});

apiRoutes.get("/delete/:id", async (req, res) => {
  const newObject = req.body;
  const uid = req.params.id;

  try {
    const deleteData = await deleteOperation({ _id: new ObjectId(uid) });

    if (deleteData.deletedCount !== 0) {
      res.send(`Deleted ${deleteData.deletedCount} elements`);
    } else {
      res.json(deleteData);
    }
  } catch (error) {
    res.send(error);
  }
});

apiRoutes.get("/*", (_, res) => {
  res.send("No endpoint found :/");
});

apiRoutes.post("/*", (_, res) => {
  res.send("No endpoint found :/");
});

module.exports = apiRoutes;
