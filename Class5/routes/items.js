const express = require("express");
const Item = require("../models/itemModel");
const isAuthorized = require("../middleware/isAuthorized");
const isAdmin = require("../middleware/isAdmin");
const router = express.Router();


/////////////////////////////////////////////////////////////////
// CREATE an item - restricted to users with the "admin" role //
///////////////////////////////////////////////////////////////
router.post("/", isAuthorized, isAdmin, async (req, res) => {
  const { title, price } = req.body;

  try {
    const item = new Item({ title, price });
    await item.save();
    res.status(201).json(item);
  } 
  // If it fails to create the item, return an error:
  catch (error) {
    res.sendStatus(400);
  }
});


//////////////////////////////////////////////
// READ/Get all items  - open to all users //
////////////////////////////////////////////
router.get("/", isAuthorized, async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  }

  // If it fails to read/get the items, return an error: 
  catch (err) {
    res.sendStatus(500);
  }
});


/////////////////////////////////////////////////////////
// READ/Get a specific item by ID - open to all users //
///////////////////////////////////////////////////////
router.get("/:id", isAuthorized, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    // If the item doesn't exist, return an error:
    if (!item) return res.sendStatus(404);
    
    // Otherwise, return the item in the response:
    res.json(item);
  }
  catch (error) {
    res.sendStatus(400);
  }
});


/////////////////////////////////////////////////////////////////
// UPDATE an item - restricted to users with the "admin" role //
///////////////////////////////////////////////////////////////
router.put("/:id", isAuthorized, isAdmin, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // If the requested item can't be found, return an error:
    if (!item) return res.sendStatus(404);
    // Otherwise, return the item in the response:
    res.json(item);
  }
  // If the update fails for some other reason, return an error:
  catch (err) {
    res.sendStatus(400);
  }
});


module.exports = router;