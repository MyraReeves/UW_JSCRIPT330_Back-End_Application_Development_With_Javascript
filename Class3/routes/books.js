const { Router } = require("express");                        // Imports the Router function from Express
const router = Router();
const bookDAO = require('../daos/book');                      // Imports DAO file


/////////////
// CREATE //
///////////
router.post("/", async (req, res, next) => {

  // Save into a variable the data extracted from the creation request body:
  const book = req.body;

  // Return an error if no book data was provided or if it's an empty object:
  if (!book || JSON.stringify(book) === '{}' ) {
    res.status(400).send('book is required');
  }
  
  // Otherwise, use the DAO to create the book and send back the result:
  else {
    try {
      const savedBook = await bookDAO.create(book);
      res.json(savedBook); 
    } 
    
    // Handle validation errors by sending back a 400 error (Bad Request):
    catch(e) {
      if (e instanceof bookDAO.BadDataError) {
        res.status(400).send(e.message);
      } 
      // Or by sending a 500 error for all other error causes:
      else {
        res.status(500).send(e.message);
      }
    }
  }
});


//////////////////////////////////////////////
// READ data for all books in the database //
////////////////////////////////////////////
router.get("/", async (req, res, next) => {

  // Set the value of "page" and "perPage" to be their corresponding values inside the query URL:
  let { page, perPage } = req.query;

  // Set the default value of "page" to 0 if no other value was given:
  page = page ? Number(page) : 0;

  // Sets default value of perPage to 10 if no other value was given:
  perPage = perPage ? Number(perPage) : 10;

  // Set the value of "authorId" to be equal to the corresponding value inside the query URL:
  const { authorId } = req.query;

  try {
    // Pass to the DAO the values of "authorId", "page", and "perPage", and save the result into the variable "books": 
    const books = await bookDAO.getAll({ authorId, page, perPage });

    // Convert "books" into JSON format and send that as the response:
    res.json(books);
  }

  // Send a 500 error if something goes wrong:
  catch (e) {
    res.status(500).send(e.message);
  }
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// READ the books data using the search function -- This handles GET requests such as "/books/search?query=Steelheart" //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/search", async (req, res, next) => {

  // Save the search request's query string inside of a variable:
  const { query } = req.query;

  // Pass that string into the DAO and return the results in JSON form:
  try {
    const results = await bookDAO.search(query);
    // If the search was successfully performed (even if no result found), return a 200 OK message along with the results (even if that result is an empty array)
    res.status(200).json(results);
  } 
  
  // Send a 500 error if something goes wrong:
  catch (e) {
    res.status(500).send(e.message);
  }
});



/////////////////////////////////////////////////////////////////////////////////////////////////////////
// READ the data for a single book using its id -- This handles GET requests such as "/books/102291"  //
///////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/:id", async (req, res, next) => {

  // Pass the requested id to the DAO and save the result in a variable called "book":
  const book = await bookDAO.getById(req.params.id);

  // If a matching id is found, return the book data in JSON form:
  if (book) {
    res.json(book);
  } 
  // Otherwise, return a 404 error:
  else {
    res.sendStatus(404);
  }
});



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// READ the data based on author stats in order to
// "return stats grouped by authorId with sorted titles" and "return stats by authorId with all author info"
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/authors/stats", async (req, res, next) => {
  try {
    // If present, save the authorInfo value from the query string that's in the URL:
    const { authorInfo } = req.query;
    // The URL will either be "/books/authors/stats?authorInfo=true" or simply "/books/authors/stats" (which is false)

    // Use that variable to pass a boolean value into the DAO, so that it knows which pipeline to use:
    const stats = await bookDAO.getStatsByAuthor(authorInfo === 'true');
    // This compares the string to "true".  So if "?authorInfo=true" is present, "true" will be passed into the DAO.  Otherwise, "false" will be passed in.

    // Return the result in JSON form alongside a 200 code:
    res.status(200).json(stats);
  }
  // In case of any errors, send a 500 error message: 
  catch (e) {
    res.status(500).send(e.message);
  }
});



////////////////////////////////////////////////////////////////////////////////////////////
// UPDATE a book's data using its id -- This handles PUT requests such as "/books/10229" //
//////////////////////////////////////////////////////////////////////////////////////////
router.put("/:id", async (req, res, next) => {

  // Save into a variable the id that appears in the request URL:
  const bookId = req.params.id;

  // Save into a variable the new data that was sent in the request body
  const book = req.body;

  // If no new data was entered to update, return a 400 error:
  if (!book || JSON.stringify(book) === '{}' ) {
    res.status(400).send('book is required');
  } 
  
  // Otherwise, use the DAO to update the book's information. If that's successful, send a 200 message; if not send a 400 error
  else {
    try {
      const success = await bookDAO.updateById(bookId, book);
      res.sendStatus(success ? 200 : 400); 
    } 
    
    // If there is a validation error, returns a 400 error:
    catch(e) {
      if (e instanceof bookDAO.BadDataError) {
        res.status(400).send(e.message);
      } 
      // For all other errors, send a 500 error message:
      else {
        res.status(500).send(e.message);
      }
    }
  }
});


////////////////////////////////////////////////////////////////////////////////////////
// DELETE a book using its id -- This handles DELETE requests such as "/books/12345" //
//////////////////////////////////////////////////////////////////////////////////////
router.delete("/:id", async (req, res, next) => {

  // Save into a variable the id that is in the request URL:
  const bookId = req.params.id;

  // Use the DAO to delete the corresponding book:
  try {
    const success = await bookDAO.deleteById(bookId);
    //  If the book is successfully deleted, return a 200 message. Otherwise, return a 400 error:
    res.sendStatus(success ? 200 : 400);
  } 
  // In the case of any errors, return a 500 error message:
  catch(e) {
    res.status(500).send(e.message);
  }
});



module.exports = router;