const express = require("express");
const Item = require("../models/itemModel");
const isAuthorized = require("../middleware/isAuthorized");
const isAdmin = require("../middleware/isAdmin");
const router = express.Router();
const itemDao = require("../DAOS/itemDao");


/////////////////////////////////////////////////////////////////
// CREATE an item - restricted to users with the "admin" role //
///////////////////////////////////////////////////////////////
router.post("/", isAuthorized, isAdmin, async (req, res) => {
  try {
    const item = await itemDao.createItem(req.body);
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
    const items = await itemDao.getAllItems();
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
    const item = await itemDao.getItemById(req.params.id);

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
    const item = await itemDao.updateItem(req.params.id, req.body);

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


/////////////////////////////////////////////////////////////////
// DELETE an item - restricted to users with the "admin" role //
///////////////////////////////////////////////////////////////
router.delete("/:id", isAuthorized, isAdmin, async (req, res) => {
  try {
    const deleted = await itemDao.deleteItem(req.params.id);

    // If the item can't be found, return a 404 error:
    if (!deleted) return res.sendStatus(404);

    // Otherwise, return confirmation that the item was deleted:
    res.json({ message: "Item deleted" });
  }
  catch (error) {
    res.sendStatus(500);
  }
});


module.exports = router;