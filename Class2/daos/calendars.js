const Calendars = require('../models/calendars');
module.exports = {};


// This CREATES/POSTS a calendar document in the database:
module.exports.create = async (name) => {
  return await Calendars.create({ name });
};



// This READS/GETS a single calendar from the database:
module.exports.getById = async (id) => {
  try {
    const calendar = await Calendars.findOne({ _id: id }).lean();                 // Utilize the lean() method after find() to retrieve data as plain JavaScript objects instead of full-fledged Mongoose documents. This bypasses Mongoose's data processing overhead, resulting in faster queries.
    return calendar;
  } catch (e) {
    return null;
  }
};



// This READS/GETS all of the calendars from the database:
module.exports.getAll = async () => {                                             // The name "getAll()" is specified in the provided routes file
  return await Calendars.find( {} ).lean();
};



// This DELETES a calendar from the database:
module.exports.removeById = async (id) => {                                     // The name "removeById()" is specified in the provided routes file
  try {
    const deletedCalendar = await Calendars.findByIdAndDelete( {_id: id} );
    return deletedCalendar;                                                     
    // Single line shortened version would be:                       return await Calendars.findByIdAndDelete( {_id: id} );
  }
  catch (e) {
    return null;
  }
};



// This UPDATES/PUTS a calendar within the database:
module.exports.updateById = async (id, newData) => {
  try {
    const calendar = await Calendars.findOneAndUpdate({ _id: id }, newData, { new: true }).lean();
    return calendar;
  } catch (e) {
    return null;
  }
};
/*
  NOTE FROM LECTURE CODE:
  For whatever reason, Mongoose doesn't perform correct schema validation when using findOneAndUpdate
  (despite them having a flag to do it). A workaround is to pass the data directly into a new schema
  instance (which exists in Mongoose, not in the DB) and run a validation function. Optionally, you could
  also call .save() on this instance (although you'd need the _id to correctly perform an update).
  Let me know if you find a workaround that runs .findOneAndUpdate with the correct validation.

  module.exports.updateById = async (id, widget) => {
  const widgetModel = new Widgets(widget);
  const validationErrors = widgetModel.validateSync();
  if (validationErrors) {
    throw validationErrors;
  }

  Note that this:         return Widgets.findByIdAndUpdate(id, widget, {projection: {__v: 0}}).lean();
  Is equivalent to this:
  const response = Widgets.findOneAndUpdate({_id: id}, widget, {projection: {__v: 0}, new: true}).lean();
  return response;
};
  
Also note that per the Mongoose docs, you can define a "projection" option in the options object.
Additionally, "new: true" is required to return the updated document, as opposed to the initial document.
You could also call widgetsDao.getById(...) again, but this is cleaner.
*/
