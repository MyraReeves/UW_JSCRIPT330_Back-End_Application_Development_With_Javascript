const mongoose = require('mongoose');
const Book = require('../models/book');
module.exports = {};


////////////////////////////////////////////////////
// CREATES a new book entry inside the database: //
//////////////////////////////////////////////////
module.exports.create = async (bookData) => {
  try {
    const created = await Book.create(bookData);
    return created;
  }
  // Throw a BadDataError message upon validation failure: 
  catch (e) {
    if (e.message.includes('validation failed')) {
      throw new BadDataError(e.message);
    }
    throw e;
  }
}
//  Create a unique error type for an invalid book creation:
class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;


/////////////////////////////////////////////////////////
// READS/GETS all the info inside the books database: //
///////////////////////////////////////////////////////
module.exports.getAll = ({ authorId, page, perPage }) => {
  // Return all books using the author id:
  const filter = {};
  if (authorId && mongoose.Types.ObjectId.isValid(authorId)) {
    filter.authorId = authorId;
  }
  // Return all books using page and perPage:
  return Book.find(filter).limit(perPage).skip(perPage * page).lean();
}

// READS/GETS the information about a SINGLE book:
module.exports.getById = (bookId) => {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return null;
  }
  return Book.findOne({ _id: bookId }).lean();
}


////////////////////////////////////////////////////////
// UPDATES a book inside the database, using its id: //
//////////////////////////////////////////////////////
module.exports.updateById = async (bookId, newObj) => {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return false;
  }
  await Book.updateOne({ _id: bookId }, newObj);
  return true;
}


////////////////////////////////////////////////
// DELETES a book listing from the database: //
//////////////////////////////////////////////
module.exports.deleteById = async (bookId) => {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return false;
  }
  await Book.deleteOne({ _id: bookId });
  return true;
}
