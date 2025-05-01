const express = require('express');
const router = express.Router();
const noteDAO = require('../DAOS/noteDAO');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


// Define Express middleware to authenticate and attach userId
const authenticationMiddleware = (req, res, next) => {

    // Get the token from the Authorization header:
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
            return res.sendStatus(401);
    }

    const token = authorizationHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.userId;
        next();
    }
    catch (error) {
        return res.sendStatus(401);
    }
};

// The following line of code will apply the middleware to all the routes below inside this file, so that every request must be authenticated:
router.use(authenticationMiddleware);


////////////////////////
// CREATE a new note //
//////////////////////
router.post('/', async (req, res) => {
  const { text } = req.body;    // Pull the text from the request body
  if (!text) return res.sendStatus(400);

  try {
    // Use the function in the DAO file to create/return a new note with the text and attach the userId (given in the request) to it:
    const newNote = await noteDAO.createNote(req.userId, text);
    res.status(200).json(newNote);
  }
  catch (error) {
    res.sendStatus(500);
  }
});


///////////////////////////////////////////////
// READ all notes for an authenticated user //
/////////////////////////////////////////////
router.get('/', async (req, res) => {
  try {
    // Pass the id inside the request to the function in the DAO file to get all the notes owned by that specific user:
    const notes = await noteDAO.getUserNotes(req.userId);
    res.status(200).json(notes);
  }
  catch (error) {
    res.sendStatus(500);
  }
});


//////////////////////////////////////////////////////////
// READ a specific note owned by an authenticated user //
////////////////////////////////////////////////////////
router.get('/:id', async (req, res) => {
    // Pull the note's id from the requested URL
    const { id } = req.params;

    // Validate that the note's id is valid:
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400);
    }

    // Get the note by using the note id and the userId:
    try {
        const note = await noteDAO.getNoteByIdForUser(req.userId, id);
        if (!note) return res.sendStatus(404);
        res.status(200).json(note);
    }
    catch (error) {
        res.sendStatus(500);
    }
});

module.exports = router;