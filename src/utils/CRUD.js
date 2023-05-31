const { MongoClient, ServerApiVersion } = require("mongodb");

const uri =
  "mongodb+srv://mateopineiroa:099389720@testdatabase.xo1gb7q.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const writeOperation = async (object) => {
  const myDB = client.db("test");
  const myColl = myDB.collection("TestCollection");

  const result = await myColl.insertOne(object);

  console.log(`A document was inserted with the _id: ${result.insertedId}`);
};

const readOperation = async (object) => {
  try {
    const myDB = client.db("test");
    const myColl = myDB.collection("TestCollection");

    const data = await myColl.findOne(object);

    console.log(data);
  } catch {
    console.log("Query failed");
  }
};

const updateOperation = async (object, newObject) => {
  try {
    const myDB = client.db("test");
    const myColl = myDB.collection("TestCollection");
    const update = {
      $set: newObject,
      // $inc: number; increments a numeric field
      // $push: element; pushes an element into an array
      // $unset: ; removes a field
    };
    const data = await myColl.updateOne(object, update);

    console.log(data);
  } catch {
    console.log("Query failed");
  }
};

const deleteOperation = async (object) => {
  try {
    const myDB = client.db("test");
    const myColl = myDB.collection("TestCollection");

    const data = await myColl.deleteOne(object);

    console.log(data);
  } catch {
    console.log("Query failed");
  }
};

module.exports = {
  writeOperation,
  readOperation,
  updateOperation,
  deleteOperation,
};
