const express = require("express");
const mongoose = require('mongoose');
const authorizationRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");
const server = express();

server.use(express.json());

server.use('/auth', authorizationRoutes);
server.use('/notes', notesRoutes);

module.exports = server;