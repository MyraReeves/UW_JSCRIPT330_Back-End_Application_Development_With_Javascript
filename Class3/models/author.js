const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String },
  yearBorn: { type: Number }
});

// Indexing is not needed for the keys in the authorSchema, since users don't need to search by author gender nor the year an author was born. Per the wording of the test files, searching using the authorId key (which is indexed in the book.js model) can take the place of searching by author name.

module.exports = mongoose.model("authors", authorSchema);