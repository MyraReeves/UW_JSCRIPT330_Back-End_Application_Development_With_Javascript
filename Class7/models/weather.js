const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true  },
  temperature: { type: Number, required: true  }
});


module.exports = mongoose.model("weather", weatherSchema);