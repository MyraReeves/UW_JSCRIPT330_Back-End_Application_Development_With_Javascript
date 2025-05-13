// Import Mongoose:
const mongoose = require("mongoose");

//////////////////////////////////////////
// Define the schema used for an item: //
////////////////////////////////////////
const itemSchema = new mongoose.Schema({

  // A title must be provided for each item and any surrounding white space will be trimmed away:
  title: { type: String, required: true, trim: true },

  // A price must be provided for each item and it can't be a negative number:
  price: { type: Number, required: true, min: 0 },
});


module.exports = mongoose.model("Item", itemSchema);