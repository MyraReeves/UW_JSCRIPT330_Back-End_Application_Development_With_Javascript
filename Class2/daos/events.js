const Events = require('../models/events');

module.exports.create = async (eventData) => {
  return await Events.create(eventData);
};

module.exports.getById = async (id) => {
  try {
    return await Events.findById(id).lean();
  } catch (e) {
    return null;
  }
};

module.exports.getAllByCalendarId = async (calendarId) => {
  return await Events.find({ calendarId }).lean();
};

module.exports.updateById = async (id, updateData) => {
  try {
    return await Events.findByIdAndUpdate(id, updateData, { new: true }).lean();
  } catch (e) {
    return null;
  }
};

module.exports.removeById = async (id) => {
  try {
    return await Events.findByIdAndDelete(id);
  } catch (e) {
    return null;
  }
};