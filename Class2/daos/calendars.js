const Calendars = require('../models/calendars');
module.exports = {};


// This CREATES/POSTS a calendar document in the database:
module.exports.create = async (name) => {
  return await Calendars.create({ name });
};


// This READS/GETS a calendar from the database:
module.exports.getById = async (id) => {
  try {
    const calendar = await Calendars.findOne({ _id: id }).lean();
    return calendar;
  } catch (e) {
    return null;
  }
};


// This UPDATES/PUTS a calendar in the database:
module.exports.updateById = async (id, newData) => {
  try {
    const calendar = await Calendars.findOneAndUpdate({ _id: id }, newData, { new: true }).lean();
    return calendar;
  } catch (e) {
    return null;
  }
};


// This DELETES a calendar in the database:
module.exports.deleteById = async (id) => {
  return Calendars.findByIdAndDelete( {_id: id} );
}
