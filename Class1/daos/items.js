const uuid = require('uuid');
const itemsModel = require('../models/items');

module.exports = {};

module.exports.getAll = () => {
  return itemsModel.items;
}

/*
FROM MDN WEB DOCS:
The findIndex() method returns the index of the first element in an array that satisfies the provided testing function.
If no elements satisfy the testing function, -1 is returned. 
The find() method, on the other hand, returns the first element that satisfies the testing function (rather than its index).
*/


/////////////////////////////////////////////////////////////////////////////////////////
// Return an item from the itemsModel array based on its id, using the find() method: //
///////////////////////////////////////////////////////////////////////////////////////
module.exports.getById = (itemId) => {
  const itemToBeFound = itemsModel.items.find(itemToBeFound => itemToBeFound.id === itemId);
  return itemToBeFound
}



module.exports.deleteById = async (itemId) => {
    // TODO: complete
}



/////////////////////////////////////////////////////////////////////////////////////////////
// Replace an existing item in an array with the value of newObj without changing its id: //
///////////////////////////////////////////////////////////////////////////////////////////
module.exports.updateById = async (itemId, newObj) => {

  // Find the index of the item with the given ID
  const requestedIndex = itemsModel.items.findIndex(item => item.id === itemId);
    
  // If the item does not exist, return null
  if (requestedIndex === -1) {
    return null;
  }

  // Find the item located at that index: 
  const currentValue = itemsModel.items[requestedIndex];

  // Use a spread operator to insert the value of newObj into that item AND ensure that the id remains what it was before:
  const newValue = { ...currentValue, ...newObj, id: currentValue.id };

  // Replace the item at the requested index with the new value:
  itemsModel.items[requestedIndex] = newValue;

  return newValue;
}



/////////////////////////////////////
// Create a new item in the array //
///////////////////////////////////
module.exports.create = async (item) => {
  const id = uuid.v4();
  const newItem = { ...item, id };
  itemsModel.items.push(newItem);
  return newItem;
}