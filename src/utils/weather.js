const request = require("postman-request");

const url =
  "http://api.weatherstack.com/current?access_key=618eea3f6c89a9adfa75a4cae98d85db&query=";

const getWeatherWithLatLong = (lat, long, callback) => {
  request({ url: url + lat + "," + long, json: true }, (error, response) => {
    if (error) {
      callback("Unable to connect to weather service", undefined);
    } else if (response.body.error) {
      callback("Please try other coordinates", undefined);
    } else {
      const { temperature, humidity } = response.body.current;
      const { region, country } = response.body.location;

      callback(undefined, { temperature, humidity, region, country });
    }
  });
};

module.exports = getWeatherWithLatLong;
