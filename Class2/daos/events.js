const Events = require('../models/events');
module.exports = {};


// This CREATES/POSTS an event:
module.exports.create = async (eventData) => {
  return await Events.create(eventData);
};


// This READS/GETS a single event:
module.exports.getById = async (id) => {
  try {
    return await Events.findById(id).lean();
  } catch (e) {
    return null;
  }
};


// This READS/GETS all of the events:
module.exports.getAllByCalendarId = async (calendarId) => {
  return await Events.find({ calendarId }).lean();
};


// This UPDATES/PUTS an event:
module.exports.updateById = async (id, updateData) => {
  try {
    return await Events.findByIdAndUpdate(id, updateData, { new: true }).lean();
  } catch (e) {
    return null;
  }
};


// This DELETES an event:
module.exports.removeById = async (id) => {
  try {
    return await Events.findByIdAndDelete(id);
  } catch (e) {
    return null;
  }
};