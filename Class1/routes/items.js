const { Router } = require("express");
const router = Router();
const itemDao = require('../daos/items');

// From lecture code-along: Set up json middleware to take incoming requests and parse the body as a json object
const bodyParser = require('body-parser');
router.use(bodyParser.json());


/////////////////////
// GET ALL ITEMS: //
///////////////////
router.get("/", (req, res, next) => {
  res.json(itemDao.getAll());                           // getAll() is defined in the daos JS file
});


/////////////////////////////
// GET ONE SPECIFIC ITEM: //
///////////////////////////
router.get("/:id", (req, res, next) => {
  // Find an item's id from the request's parameters:
  const findItemId = req.params.id;         // Lecture code-along was:    res.send(req.params.id);

  // Get the item by id using the getById method (defined in the daos file) on the itemDao variable defined above:
  const item = itemDao.getById(findItemId);

  /* Return a 200 status if the item is found
  Test file's wording =                       expect(res.statusCode).toEqual(200)
  ALSO, return the found item in the body of the response    
  Test file's wording =                       expect(res.body).toEqual(items) 
  and                                         expect(res.body).toEqual(items[1])
  
  OR return a 404 status if the item is not found.           [Test file wording =   expect(res.statusCode).toEqual(404)   ]
  */
  if (item) {
    res.status(200).json(item);       // This returns the item alongside the 200 OK status
  } else {
    res.sendStatus(404);      // This returns the 404 status
  }
});


/////////////////////////
// CREATE A NEW ITEM: //
///////////////////////
router.post("/", (req, res, next) => {
  itemDao.create(req.body);                           // create() is defined in the daos JS file
  res.sendStatus(200);
});


//////////////////////
// UPDATE AN ITEM: //
////////////////////
router.put("/:id", (req, res, next) => {
  // Find an item's id from the request's parameters:
  const itemId = req.params.id;

  // Update the item by id using the method defined in the daos JS file:
  const updatedItem = itemDao.updateById(itemId, req.body);

  // Set the status to 200, since all 3 PUT tests say                           expect(res.statusCode).toEqual(200);
  res.sendStatus(200);
});


//////////////////////
// DELETE AN ITEM: //
////////////////////
router.delete("/:id", (req, res, next) => {
  // Find the item's id from the request's parameters:
  const itemID = req.params.id;

  // Delete the item using the method defined in the daos JS file:
  const itemDeleted = itemDao.deleteById(itemID);

  // The test file's wording for describe("DELETE /:id") is                      expect(res.statusCode).toEqual(200)
  res.sendStatus(200);
});




module.exports = router;