// Import Mongoose:
const mongoose = require("mongoose");

////////////////////////////////////////////
// Define the schema for a user's order: //
//////////////////////////////////////////
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,     // Refer to the user who placed the order
    ref: "User",                              // Refer to the User model
    required: true,                           // UserId is required
  },

  items: {
    type: [
      { type: mongoose.Schema.Types.ObjectId,     // Create an array using the item ids
      ref: "Item" }                               // Refer to the Item model
    ],
    required: true,                               // ItemId is required
    validate: v => v.length > 0                   // Ensure that the array is not empty
  },

  total: { 
    type: Number,       // The total dollar amount must be a number
    required: true,     // A total sum of all the item prices is required
    min: 0              // Enforce that the total cannot be negative 
  },
});


module.exports = mongoose.model("Order", orderSchema);