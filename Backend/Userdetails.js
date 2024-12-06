const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  dob: { type: Date, required: true },
  email: { type: String, required: true, unique: true }, // Ensure email is unique
  pass: { type: String, required: true },
});

const User = mongoose.model("user", userSchema);
module.exports = User;
