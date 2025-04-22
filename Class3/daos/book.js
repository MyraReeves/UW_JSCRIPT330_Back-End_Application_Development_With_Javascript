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
    // Otherwise, throw the default error message for all other failures:
    throw e;
  }
}
//  Create a unique error type for an invalid book creation:
class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;



////////////////////////////////////////////////////////////////////////////////////////////////
// READS/GETS all books inside the database (either global results or author-specific ones): //
//////////////////////////////////////////////////////////////////////////////////////////////
module.exports.getAll = ({ authorId, page, perPage }) => {

  // Create an empty object query filter so that it can be used in the Book.find(filter) return statement to control whether what gets returned is author-specific or not:
  const filter = {};
  
  // Check whether an authorId was provided and whether it is a valid MongoDB ObjectId:
  if (authorId && mongoose.Types.ObjectId.isValid(authorId)) {
    // Change the value of the filter object to { authorId: authorId } :
    filter.authorId = authorId;
  }

  // Return all books for an author if authorId is provided **OR** return all books in the db if no authorId is provided (filter remains an empty object if no authorId was provided):
  return Book.find(filter).limit(perPage).skip(perPage * page).lean();
}
/* EXPLANATION OF THE PRE-EXISTING CODE PROVIDED:       
.limit(perPage)             restricts the number of results
.skip(perPage * page)       paginates the results. Page 0 is the first page
.lean()                     returns plain JS objects instead of full Mongoose documents
*/



///////////////////////////////////////////////////////////////////
// READS/GETS the information about a SINGLE book using its id: //
/////////////////////////////////////////////////////////////////
module.exports.getById = (bookId) => {

  // Return "null" if the bookId is not a valid ObjectId:
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return null;
  }

  // Return the single book that has the matching id:
  return Book.findOne({ _id: bookId }).lean();          // .lean() converts the Mongoose document into a plain JavaScript object
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
