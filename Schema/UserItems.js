const mongoose = require("mongoose");

const ItemSchema = new Schema({
  name: String,
  description: String,
  dateAcquired: Date,
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  items: [ItemSchema],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
