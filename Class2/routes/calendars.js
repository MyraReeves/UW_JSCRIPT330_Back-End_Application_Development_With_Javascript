const { Router } = require("express");
const CalendarDAO = require('../daos/calendars');
const router = Router();


// CREATE:
router.post("/", async (req, res, next) => {
  try {
    const {name} = req.body;    //  Checks for the presence of "name" inside the POST request body. See calendarSchema inside the models file for the mongoose schema

    if (!name) {
      return res.sendStatus(400);   // If "name" doesn't exist inside the request body, returns a 400 error code
    }

    const calendar = await CalendarDAO.create({ name });
    res.sendStatus(200).send(calendar);     // Creates a new calendar with the name object inside
  } 
  catch (e) {
    next(e);
  }
});



// READ:
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



// UPDATE:
router.put("/:id", async (req, res, next) => {
  try {
    const {name} = req.body;    //  Checks for the presence of "name" inside the request body. See calendarSchema inside the models file for the mongoose schema with { type: String, required: true }

    if (!name) {
      return res.sendStatus(400);   // If the "name" object doesn't exist inside the request body, return a 400 error code
    }

    const calendar = await CalendarDAO.updateById(req.params.id, { name });   // Send the id and the new name within the update request

    if (!calendar) {
      return res.sendStatus(404);     // Return a 404 error if there is no matching id [See first part of calendar PUT test]
    }

    res.status(200).send(calendar);   // Update the calendar document
  } catch (e) {
    next(e);
  }
});



// DELETE:
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