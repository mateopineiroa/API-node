const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const ItemSchema = new mongoose.Schema({
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

/* pre-save hook that automatically hashes the password before it fets stored in the database */
UserSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password") || user.isNew) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
  }

  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
