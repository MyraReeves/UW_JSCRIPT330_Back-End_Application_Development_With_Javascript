const { Router } = require("express");
const router = Router({ mergeParams: true });          // Due to calendarId, this provided line of code takes the place of "const router = Router();"
const EventDAO = require('../daos/events');
const CalendarDAO = require('../daos/calendars');


// CREATE:
router.post("/", async (req, res, next) => {
    try {
      const calendar = await CalendarDAO.getById(req.params.calendarId);
      if (!calendar) return res.sendStatus(404);
      const { name, date } = req.body;
      if (!name || !date) return res.sendStatus(400);
      const event = await EventDAO.create({
        name, date, calendarId: req.params.calendarId
      });
      res.json(event);
    } catch(e) { next(e); }
  });


// READ:
router.get("/", async (req, res, next) => {
  try {
    const calendar = await CalendarDAO.getById(req.params.calendarId);
    if (!calendar) return res.sendStatus(404);
    const events = await EventDAO.getAllByCalendarId(req.params.calendarId);
    res.json(events);
  } catch(e) { next(e); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const event = await EventDAO.getById(req.params.id);
    if (!event || event.calendarId.toString() !== req.params.calendarId) {
      return res.sendStatus(404);
    }
    res.json(event);
  } catch(e) { next(e); }
});


// UPDATE:
router.put("/:id", async (req, res, next) => {
  try {
    const existing = await EventDAO.getById(req.params.id);
    if (!existing || existing.calendarId.toString() !== req.params.calendarId) {
      return res.sendStatus(404);
    }
    const { name, date } = req.body;
    const updated = await EventDAO.updateById(req.params.id, { name, date });
    res.json(updated);
  } catch(e) { next(e); }
});


// DELETE:
router.delete("/:id", async (req, res, next) => {
  try {
    const existing = await EventDAO.getById(req.params.id);
    if (!existing || existing.calendarId.toString() !== req.params.calendarId) {
      return res.sendStatus(404);
    }
    await EventDAO.removeById(req.params.id);
    res.sendStatus(200);
  } catch(e) { next(e); }
});

module.exports = router;