const express = require("express");
const routes = require("./routes");
const landingRoutes = require('./routes/landing');
const weatherRoutes = require('./routes/weather');
const server = express();


server.use(express.json());
server.use(routes);
server.use('/landing', landingRoutes);
server.use('/weather', weatherRoutes);

module.exports = server;