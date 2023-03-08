const request = require("postman-request");

const geoCodingUrl =
  "http://api.positionstack.com/v1/forward?access_key=433d7a99a55c81db36aac77c48863ec9&query=";

const getLatLong = (name, callback) => {
  request({ url: geoCodingUrl + name, json: true }, (error, response) => {
    if (error) {
      callback("Unable to connect to the location service", undefined);
    } else if (response.body.data.length === 0) {
      callback("Please try other location name", undefined);
    } else {
      const { latitude, longitude } = response.body.data[0];
      callback(undefined, {
        latitude,
        longitude,
      });
    }
  });
};

module.exports = getLatLong;
