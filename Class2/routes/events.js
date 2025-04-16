const { Router } = require("express");
const router = Router({ mergeParams: true });          // Due to calendarId, this provided line of code takes the place of "const router = Router();"
const EventDAO = require('../daos/events');
const CalendarDAO = require('../daos/calendars');


// CREATE:
router.post("/", async (req, res, next) => {
    try {
      const calendar = await CalendarDAO.getById(req.params.calendarId);    // Uses the url to look up a calendar within the database, using its id
      if (!calendar) return res.sendStatus(404);            // Returns a 404 error code if the calendar id does not exist

      const { name, date } = req.body;
      if (!name || !date) return res.sendStatus(400);       // Returns a 400 error code if no name is provided OR if no date is provided
      
      const event = await EventDAO.create({ name, date, calendarId: req.params.calendarId });
      res.json(event);                                      // Creates a new event with name, date, and calendar id
    } 
    catch(e) { next(e); }
});



// READ:
router.get("/", async (req, res, next) => {
  try {
    const calendar = await CalendarDAO.getById(req.params.calendarId);      // Uses the url to look up a calendar within the database, using its id

    if (!calendar) return res.sendStatus(404);                  // Returns 404 error when the calendar does not exist
    
    const events = await EventDAO.getAllByCalendarId(req.params.calendarId);
    res.json(events);                                           // Returns all events for the calendar
  } 
  catch(e) { next(e); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const event = await EventDAO.getById(req.params.id);        // Looks up an event within the database, using its id
    
    if (!event || event.calendarId.toString() !== req.params.calendarId) {
      return res.sendStatus(404);                   // Returns 404 error if the event id does not exist OR if the calendar id does not match
    }
    res.json(event);                                // Returns the event that has the specified id
  } 
  catch(e) { next(e); }
});



// UPDATE:
router.put("/:id", async (req, res, next) => {
  try {
    const event = await EventDAO.getById(req.params.id);        // Looks up an event within the database, using its id

    if (!event || event.calendarId.toString() !== req.params.calendarId) {
      return res.sendStatus(404);               // Returns a 404 error if the event id doesn't exist OR the calendar id does not match
    }

    const { name, date } = req.body;
    const updated = await EventDAO.updateById(req.params.id, { name, date });
    res.json(updated);                      // Updates the event
  } 
  catch(e) { next(e); }
});



// DELETE:
router.delete("/:id", async (req, res, next) => {
  try {
    const event = await EventDAO.getById(req.params.id);        // Looks up an event within the database, using its id

    if (!event || event.calendarId.toString() !== req.params.calendarId) {
      return res.sendStatus(404);                       // Returns a 404 error code if the event id does not exist OR if the calendar id does not match
    }

    await EventDAO.removeById(req.params.id);           // Deletes the event that had the specified id
    res.sendStatus(200);                                // Sends a response status code of 200 after deletion
  } 
  catch(e) { next(e); }
});

module.exports = router;