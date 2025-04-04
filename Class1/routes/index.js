const { Router } = require("express");
const router = Router();

router.use("/items", require("./items"));

module.exports = router;
