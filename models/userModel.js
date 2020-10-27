const mongoose = require("mongoose");

const userScheme = mongoose.Schema({
  userFirstName: String,
  userLastName: String,
  userId: String,
  userUserName: String,
});

module.exports = mongoose.model("User", userScheme);
