const express = require("express");
const Order = require("../models/orderModel");
const Item = require("../models/itemModel");
const isAuthorized = require("../middleware/isAuthorized");
const isAdmin = require("../middleware/isAdmin");
const orderDao = require("../DAOS/orderDao");
const itemDao = require("../DAOS/itemDao");
const router = express.Router();


//////////////////////
// CREATE an order //
////////////////////
router.post("/", isAuthorized, async (req, res) => {
    // Take an array of item \_id values (repeat values can appear).
    const { items } = req.body;

    // If no items have been selected (ie it's an empty array), return a 400 error:
    if (!items || !Array.isArray(items) || items.length === 0) {
    return res.sendStatus(400);
    }

    // An order should be created with a `total` field with the total cost of all the items from the time the order is placed (as the item prices could change). The order should also have the `userId` of the user placing the order.
    try {
        const foundItems = await itemDao.getAllItems();

        // Calculate the total including any duplicate items:
        const itemMap = Object.fromEntries(foundItems.map(
            i => [i._id.toString(), i.price]
        ));
        let total = 0;
        for (const id of items) {
            // If a given item id doesn't exist, return an error:
            if (!itemMap[id]){
                return res.sendStatus(400);
            }
            // Otherwise, add the item to the running total:
            total += itemMap[id];
        }

        const order = await orderDao.createOrder({
            userId: req.user._id,
            items,
            total,
        });

        res.status(201).json(order);
    }

    // If it fails to create an order for some reason, return a 500 error:
    catch (error) {
    res.sendStatus(500);
  }
});



//////////////////////////
// READ/Get all orders //
////////////////////////
router.get("/", isAuthorized, async (req, res) => {
    
    // Return all the orders made by the user making the request if not an admin user.
    // If they are an admin user it should return all orders in the DB.
    try {
        const filter = req.user.roles.includes("admin") ? {} : { userId: req.user._id };
        const orders = await orderDao.getOrders(filter);
        res.json(orders);
    }

    // If getting the orders fails for some reason, return a 500 error:
    catch (error) {
        res.sendStatus(500);
    }
});


////////////////////////////////
// READ/Get a specific order //
//////////////////////////////
router.get("/:id", isAuthorized, async (req, res) => {

    try {
        // Return an order with the `items` array containing the full item objects rather than just their \_id
        const order = await orderDao.getOrderByIdPopulated(req.params.id);

        // If the order can't be found, return a 404 error:
        if (!order) return res.sendStatus(404);

        const isOwner = order.userId.toString() === req.user._id;
        const isAdminUser = req.user.roles.includes("admin");

        // An admin user should be able to get any order.
        // But if the user is a normal user, then return a 404 if they did not place the order:
        if (!isOwner && !isAdminUser) {
            return res.sendStatus(404);
        }

        // Return the order with the `items` array containing the full item objects rather than just their \_id
        res.json(order);
    }

    // If it fails to get the specified order, return a 400 error:
    catch (err) {
        res.sendStatus(400);
    }
});


///////////////////////////////////
// DELETE an order - Admin only //
/////////////////////////////////
router.delete("/:id", isAuthorized, isAdmin, async (req, res) => {
    try {
        const deleted = await orderDao.deleteOrder(req.params.id);

        // If the order can't be found, return a 404 error:
        if (!deleted) return res.sendStatus(404);

        // Otherwise, return confirmation that the order was deleted:
        res.json({ message: "Order deleted" });
    } 
    catch (err) {
      res.sendStatus(500);
    }
  });


module.exports = router;