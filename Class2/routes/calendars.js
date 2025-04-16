const { Router } = require("express");
const CalendarDAO = require('../daos/calendars');
const router = Router();


// Create:
router.post("/", async (req, res, next) => {
  try {
    const {name} = req.body;    //  Checks for the presence of "name" inside the POST request body. See calendarSchema inside the models file
    if (!name) {
      return res.sendStatus(400);   // If "name" doesn't exist inside the request body, returns a 400 error code
    }
    const calendar = await CalendarDAO.create({ name });    // Creates a new calendar if name is provided
    res.sendStatus(200).send(calendar);
  } catch (e) {
    next(e);
  }
});


// Read:
router.get("/", async (req, res, next) => {
  try {
    const calendars = await CalendarDAO.getAll();
    res.json(calendars);
  } catch(e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const calendar = await CalendarDAO.getById(req.params.id);
    if (calendar) {
      res.json(calendar);
    } else {
      res.sendStatus(404);
    }
  } catch(e) {
    next(e);
  }
});


// Update:
router.put("/:id", async (req, res, next) => {
  try {
    const calendar = await CalendarDAO.updateById(req.params.id);
    if (calendar) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch(e) {
    next(e);
  }
});


// Delete:
router.delete("/:id", async (req, res, next) => {
  try {
    const calendar = await CalendarDAO.removeById(req.params.id);
    if (calendar) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch(e) {
    next(e);
  }
});


module.exports = router;