const jwt = require("jsonwebtoken");

/**
 * After the user has this token, it should include it in the header of each subsequent request.
 * @param {Object} data Receives the object to be sent to the user
 * @returns The token containing encrypted data using PRIVATE_KEY
 */
const dataEncrypter = (data) => {};
