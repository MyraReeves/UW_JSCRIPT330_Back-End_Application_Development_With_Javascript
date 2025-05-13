// Import the model:
const Item = require("../models/itemModel");

////////////////////////
// CREATE a new item //
//////////////////////
async function createItem(data) {
    const item = new Item(data);
    return await item.save();
}

/////////////////////
// READ all items //
///////////////////
async function getAllItems() {
    return await Item.find();
}

//////////////////////////////////////
// READ a single item using its ID //
////////////////////////////////////
async function getItemById(id) {
    return await Item.findById(id);
}

//////////////////////////////
// UPDATE an existing item //
////////////////////////////
async function updateItem(id, updates) {
    return await Item.findByIdAndUpdate(id, updates, { new: true });
}

//////////////////////////////////
// Delete an item using its ID //
////////////////////////////////
async function deleteItem(id) {
    return await Item.findByIdAndDelete(id);
}

module.exports = {
    createItem,
    updateItem,
    getAllItems,
    getItemById,
    deleteItem
};