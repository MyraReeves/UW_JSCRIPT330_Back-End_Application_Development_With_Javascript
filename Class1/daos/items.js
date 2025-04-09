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


// Return an item from the itemsModel array based on its id, using the find() method:
module.exports.getById = (itemId) => {
  const itemToBeFound = itemsModel.items.find(itemToBeFound => itemToBeFound.id === itemId);
  return itemToBeFound
}


module.exports.deleteById = async (itemId) => {
    // TODO: complete
}

module.exports.updateById = async (itemId, newObj) => {
    // TODO: complete
}

module.exports.create = async (item) => {
  const id = uuid.v4();
  const newItem = { ...item, id };
  itemsModel.items.push(newItem);
  return newItem;
}