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


//////////////////////////////
// READ data for all books //
////////////////////////////
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



///////////////////////////////////////////////////
// READ the data for a single book using its id //
/////////////////////////////////////////////////
router.get("/:id", async (req, res, next) => {

  // 
  const book = await bookDAO.getById(req.params.id);
  if (book) {
    res.json(book);
  } else {
    res.sendStatus(404);
  }
});


// Update
router.put("/:id", async (req, res, next) => {
  const bookId = req.params.id;
  const book = req.body;
  if (!book || JSON.stringify(book) === '{}' ) {
    res.status(400).send('book is required"');
  } else {
    try {
      const success = await bookDAO.updateById(bookId, book);
      res.sendStatus(success ? 200 : 400); 
    } catch(e) {
      if (e instanceof bookDAO.BadDataError) {
        res.status(400).send(e.message);
      } else {
        res.status(500).send(e.message);
      }
    }
  }
});


// Delete
router.delete("/:id", async (req, res, next) => {
  const bookId = req.params.id;
  try {
    const success = await bookDAO.deleteById(bookId);
    res.sendStatus(success ? 200 : 400);
  } catch(e) {
    res.status(500).send(e.message);
  }
});


module.exports = router;