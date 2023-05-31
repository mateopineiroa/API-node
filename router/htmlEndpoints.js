const express = require("express");
const router = express.Router();

router.get("", (req, res) => {
  res.render("index", {
    title: "Weather rendered dynamically with hbs (handlebars)",
    name: "Mateo Piñeiro",
  });
});

router.get("/", (req, res) => {
  res.send("Auxiliary default route");
});

router.get("/help", (req, res) => {
  res.render("help", {
    title: "This is the help screen dynamically",
    name: "Carlitos",
    lastName: 32,
  }); //This gets transformed to json automatically
});

router.get("/about", (req, res) => {
  // res.send("<h2>About page</h2>");
  res.render("about", {
    title: "This about screen has been rendered by the server",
  });
});

router.get("/testJs", (req, res) => {
  res.send("<script>console.log('Este script vino del servidor')</script>");
});

router.get("/weather?address=uy", (req, res) => {
  res.send("Sorry, the weather api doesn't support the 'uy' location");
});

router.get("/weather", (req, res) => {
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

router.get("/products", (req, res) => {
  console.log(req.query);
  if (!req.query.search) {
    return res.send({ error: "You must provide a search term" });
  }

  res.send({
    products: [],
  });
});

router.get("/help/*", (req, res) => {
  res.send("Help article not found");
});

/* Error needs to come last */
router.get("*", (req, res) => {
  res.send(req.params);
  // res.send("My 404 page" + `${req.query}`);
});

module.exports = router;
