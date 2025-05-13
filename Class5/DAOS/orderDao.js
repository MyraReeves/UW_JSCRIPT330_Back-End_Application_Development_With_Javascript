// Import the model:
const Order = require("../models/orderModel");

/////////////////////////
// CREATE a new order //
///////////////////////
async function createOrder(data) {
    const order = new Order(data);
    return await order.save();
}

//////////////////////
// READ all orders //
////////////////////
async function getOrders(filter = {}) {      // This is admin or user-specific based on the filter
    return await Order.find(filter);
}

/////////////////////////////////////////////////////////////////////////////////////////////
// READ a single order and populate what is returned with the details of the items inside //
///////////////////////////////////////////////////////////////////////////////////////////
async function getOrderByIdPopulated(id) {
    return await Order.findById(id).populate("items");
}

///////////////////////////////////
// DELETE an order using its ID //
/////////////////////////////////
async function deleteOrder(id) {
    return await Order.findByIdAndDelete(id);
}
  
module.exports = {
    createOrder,
    getOrders,
    getOrderByIdPopulated,
    deleteOrder
};