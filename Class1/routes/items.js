const { Router } = require("express");
const router = Router();

const itemDao = require('../daos/items');

router.get("/", (req, res, next) => {
  res.json(itemDao.getAll())
});

router.get("/:id", (req, res, next) => {
  // TODO: complete this route
  res.sendStatus(501);
});

router.post("/", (req, res, next) => {
  itemDao.create(req.body);
  res.sendStatus(200);
});

router.put("/:id", (req, res, next) => {
  // TODO: complete this route
  res.sendStatus(501);
});

router.delete("/:id", (req, res, next) => {
  // TODO: complete this route
  res.sendStatus(501);
});

module.exports = router;
