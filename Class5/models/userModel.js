// Import Mongoose:
const mongoose = require("mongoose");

//////////////////////////////////////////////
// Define the schema for a user's account: //
////////////////////////////////////////////
const userSchema = new mongoose.Schema({
  // A password is required
  password: { type: String, required: true },

  // Email is required, no duplicate emails are allowed, surrounding white space should be removed from the provided email, and all emails should be converted to all lowercase letter:
  email: { type: String, unique: true, required: true, trim: true, lowercase: true },

  // There is an array of roles, each user is required to have a role assigned to them, and the default role is "user":
  roles: { type: [String], required: true, default: ["user"] },
});

module.exports = mongoose.model("User", userSchema);
