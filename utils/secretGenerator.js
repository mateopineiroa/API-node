const crypto = require("crypto");

// generate 256-bit (32-byte) random string
const secret = crypto.randomBytes(32).toString("hex");

console.log(secret);
