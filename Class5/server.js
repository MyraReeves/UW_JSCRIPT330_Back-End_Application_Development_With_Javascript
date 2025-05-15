const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
// const dotenv = require(".env");
const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/items");
const orderRoutes = require("./routes/orders");

const server = express();

// dotenv.config();

server.use(express.json());
server.use("/auth", authRoutes);
server.use("/items", itemRoutes);
server.use("/orders", orderRoutes);


/* Temporarily removing this block of code for testing purposes.

// Connect to MongoDB:
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB due to the following error:", err);
  });

*/

module.exports = server;
