const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  password: { type: String, required: true },
  // TODO: Add additional attributes
});


module.exports = mongoose.model("users", userSchema);