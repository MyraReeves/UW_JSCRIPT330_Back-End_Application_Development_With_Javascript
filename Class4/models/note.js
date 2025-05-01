const mongoose = require('mongoose');
const User = require('./userModel');

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: mongoose.Schema.ObjectId, ref: User, index: true }
});


module.exports = mongoose.model("notes", noteSchema);