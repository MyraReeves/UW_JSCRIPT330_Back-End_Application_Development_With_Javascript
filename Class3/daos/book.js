const mongoose = require('mongoose');
const Book = require('../models/book');
module.exports = {};


////////////////////////////////////////////////////
// CREATE a new book entry inside the database: //
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
// READ/GET all books inside the database (either global results or author-specific ones): //
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
// READ/GET the information about a SINGLE book using its id: //
/////////////////////////////////////////////////////////////////
module.exports.getById = (bookId) => {

  // Return "null" if the bookId is not a valid ObjectId:
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return null;
  }

  // Return the single book that has the matching id:
  return Book.findOne({ _id: bookId }).lean();          // .lean() converts the Mongoose document into a plain JavaScript object
}



///////////////////////////////////////////////////////////////////////////////////////////////////
// READ/GET books using the text index fields defined in the model file (title, genre, blurb): //
/////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.search = async (searchQuery) => {        // In the unit tests, the value of searchQuery is "Harlem", "Fantasy and Kings", or "Superhero"

  // If no search term is provided, return an empty array:
  if (!searchQuery) return [];

  return Book.find(
    //  Search using the provided search term:
    { $text: { $search: searchQuery } },

    // Rank how relevant the resulting book is to the search terms that were provided:
    { score: { $meta: "textScore" } }
  )
  // According to the test file, the returned results should then be "sorted by best matching single term." So sort by the textScore, in descending order (most relevant first):
  .sort({ score: { $meta: "textScore" } }).lean();

};


////////////////////////////////////////////////////////////////////////////////////////////
// READ/GET each book using its authorId,                                                //
// group with each author's books sorted by title                                       //
// Include all the author's details if requested                                       //
////////////////////////////////////////////////////////////////////////////////////////

// Set the value of "includeAuthorInfo" to be false by default:
module.exports.getStatsByAuthor = async (includeAuthorInfo = false) => {

  // Set up a MongoDB aggregation pipeline (this will be "an array of stages that transform the data step by step"):
  const pipeline = [
    {
      // Group all books by their authorId:
      $group: {
        _id: "$authorId",
        titles: { $push: "$title" },              // Collects all the book titles for an author into an array
        pageCounts: { $push: "$pageCount" }       // Collects all the page counts for the author’s books into an array
      }
    },
    {
      // Reshape the data for each author group: 
      $project: {
        authorId: "$_id",
        titles: { $sortArray: { input: "$titles", sortBy: 1 } },    // Sorts the array of book titles
        averagePageCount: { $avg: "$pageCounts" },                  // Calculates the average of values in the pageCounts array
        numBooks: { $size: "$titles" },                     // Uses the length of the titles array to calculate the number of books
        _id: 0                                                      // Omits the default MongoDB _id field from output
      }
    }
  ];

  //  If the URL is "/books/authors/stats?authorInfo=true"...
  if (includeAuthorInfo) {
    // ...add the following additional steps to the aggregation pipeline:
    pipeline.push(
      {
        // Use "lookup" (Quote from internet: "$lookup lets you pull in data from a different collection, matching based on a shared key between the two collections.")
        $lookup: {
          from: "authors",          // Pull from the collection of authors
          localField: "authorId",   // Look at the value inside of authorId
          foreignField: "_id",      // Match it against the _id field in the authors collection
          as: "author"              // Store the result in an array named "author"
        }
      },
      {
        // Change the output so each result has a single embedded author object instead of an array:
        $unwind: "$author"
      }
    );
  }

  return Book.aggregate(pipeline);
};

// Qutoe: "A pipeline refers specifically to the aggregation pipeline — a framework used to process data in multiple stages. Each stage transforms the data in some way (e.g., filtering, grouping, sorting), and the result of one stage is passed to the next — like an assembly line."


////////////////////////////////////////////////////////////////////////////
// UPDATES a book with new values, using its id to locate and update it: //
//////////////////////////////////////////////////////////////////////////
module.exports.updateById = async (bookId, newObj) => {

  // Returns "false" if the bookId is not a proper MongoDB ObjectId:
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return false;
  }

  // Looks for a book with a matching _id and applies the newObj values to it, then returns "true":
  await Book.updateOne({ _id: bookId }, newObj);
  return true;
}



////////////////////////////////////////////////
// DELETES a book listing from the database: //
//////////////////////////////////////////////
module.exports.deleteById = async (bookId) => {

  // Prevent a database error from occurring, by returning "false" if the book id is not a valid MongoDB ObjectId:
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return false;
  }

  // Delete the book whose _id matches bookId:
  await Book.deleteOne({ _id: bookId });
  return true;
}
