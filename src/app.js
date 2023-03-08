const path = require("path");
const express = require("express");
const weather = require("./utils/weather");
const latLong = require("./utils/latLong");

// console.log(__dirname);
// console.log(__filename);
// console.log(path.join(__dirname, "../public"));

const app = express(); //express() initializes the app and you configure it with it's methods

// Define paths for Express config
const publicDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);

// Setup static directory to serve
app.use(express.static(publicDirPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather rendered dynamically with hbs (handlebars)",
    name: "Mateo Piñeiro",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "This is the help screen dynamically",
    name: "Carlitos",
    lastName: 32,
  }); //This gets transformed to json automatically
});

app.get("/about", (req, res) => {
  // res.send("<h2>About page</h2>");
  res.render("about", {
    title: "This about screen has been rendered by the server",
  });
});

app.get("/testJs", (req, res) => {
  res.send("<script>console.log('Este script vino del servidor')</script>");
});

app.get("/weather?address=uy", (req, res) => {
  res.send("Sorry, the weather api doesn't support the 'uy' location");
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send("Error, you didn't add an address");
  }
  latLong(req.query.address, (error, { latitude, longitude } = {}) => {
    if (error) {
      console.log(error);
      res.send({ error: "Sorry, wrong location name" });
    } else {
      weather(latitude, longitude, (error, data) => {
        if (error) {
          console.log(error);
        } else {
          const { temperature, humidity, region, country } = data;
          res.send({
            queryAddress: req.query.address,
            forecast: {
              temperature,
              humidity,
              region,
              country,
            },
          });
        }
      });
    }
  });
});

app.get("/products", (req, res) => {
  console.log(req.query);
  if (!req.query.search) {
    return res.send({ error: "You must provide a search term" });
  }

  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.send("Help article not found");
});

/* Error needs to come last */
app.get("*", (req, res) => {
  res.send("My 404 page");
});

app.listen(3000, () => {
  console.log("Server is up in port 3000, http://localhost:3000");
});
