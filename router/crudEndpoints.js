const express = require("express");
const {
  writeOperation,
  readOperation,
  updateOperation,
  deleteOperation,
} = require("../src/utils/CRUD");
const { ObjectId } = require("mongodb");
const multer = require("multer");

const apiRoutes = express.Router();

const upload = multer();

apiRoutes.get("/", (req, res) => {
  res.send("The endpoint works :)");
});

apiRoutes.get("/query", async (req, res) => {
  res.set("Cache-Control", "public, max-age=3600"); // The response is cacheable
  const params = req.query; // Gets the variables on the url
  try {
    const objectFound = await readOperation(params);

    res.send(objectFound);
  } catch {
    res.send("Object not found");
  }
});

apiRoutes.get("/query/:id", async (req, res) => {
  res.set("Cache-Control", "public, max-age=3600"); // The response is cacheable
  const userId = req.params.id; // Gets the chars on the :id part of the url

  try {
    const objectFound = await readOperation({ _id: new ObjectId(userId) });

    res.send(objectFound);
  } catch {
    res.send("Object not found");
  }
});

apiRoutes.post("/write", async (req, res) => {
  const object = req.body; // gets the object from the request body

  try {
    const result = await writeOperation(object);

    res.json(result);
  } catch {
    res.send("Error getting the data");
  }
});

apiRoutes.post("/uploadImage", upload.single("image"), async (req, res) => {
  const imageBuffer = req.file.buffer;

  try {
    const result = await writeOperation({
      image: imageBuffer,
      name: "Test upload image",
    });

    res.status(200).json({ ...result, message: "Image uploaded successully" });
  } catch {
    res.send("Error getting the data");
  }
});

apiRoutes.get("/queryImage/:id", async (req, res) => {
  res.set("Cache-Control", "public, max-age=3600"); // The response is cacheable
  const imageId = req.params.id; // Gets the :id on the request url

  try {
    const image = await readOperation({ _id: new ObjectId(imageId) });

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    /* WARNING: DO NOT PUSH THIS CODE UNCOMMENTED TO VERCEL. IT WILL GENERATE FILES IN THE SERVER */
    /* Adds file to folder images. */
    // fs.writeFile("images/image.jpg", image.image.buffer, "binary", (error) => {
    //   if (error) {
    //     console.error("Error converting buffer to image:", error);
    //   } else {
    //     console.log("Image file created successfully");
    //   }
    // });

    /* The format needs to adapt depending on the image received. How do i know the image type? */
    res.set("Content-Type", "image/jpeg"); // Set the appropriate Content-Type header for the image file format
    res.send(image.image.buffer); // Send the image binary data as the response
  } catch {
    res.send("Object not found");
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
  res.send("Empty string set of routes, no endpoint found in this scope :/");
});

apiRoutes.post("/*", (_, res) => {
  res.send("Empty string set of routes, no endpoint found in this scope :/");
});

module.exports = apiRoutes;
