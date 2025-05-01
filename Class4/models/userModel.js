const mongoose = require('mongoose');

// Create a schema:
const userSchema = new mongoose.Schema({
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  twoFactorVerification: {type: String},
});

// Define the model:
const User = mongoose.model('User', userSchema)

// Export the model:
module.exports = User;