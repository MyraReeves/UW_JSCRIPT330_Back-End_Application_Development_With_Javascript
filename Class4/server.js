const express = require("express");
const mongoose = require('mongoose');
const authorizationRoutes = require("./routes/auth");
const server = express();

server.use(express.json());

server.use('/auth', authorizationRoutes);

module.exports = server;