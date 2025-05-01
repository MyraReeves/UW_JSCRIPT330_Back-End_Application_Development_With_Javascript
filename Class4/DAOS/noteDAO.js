const Note = require('../models/note');
const mongoose = require('mongoose');

module.exports = {};

// Create a note for a specific user:
module.exports.createNote = async (userId, text) => {
  const note = await Note.create({ text, userId });
  return note.toObject();
};

// Get all notes for a user, based on their id:
module.exports.getUserNotes = async (userId) => {
  const notes = await Note.find({ userId }).lean();
  return notes;
};

// Get a single note by a user:
module.exports.getNoteByIdForUser = async (userId, noteId) => {
  if (!mongoose.isValidObjectId(noteId)) return null;
  const note = await Note.findOne({ _id: noteId, userId }).lean();
  return note;
};