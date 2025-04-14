const mongoose = require('mongoose');

/* Quote from https://mongoosejs.com/docs/schematypes.html  

"type: is a special property in Mongoose schemas. When Mongoose finds a nested property named type in your schema, Mongoose assumes that it needs to define a SchemaType with the given type.

SchemaTypes handle definition of path defaults, validation, getters, setters, field selection defaults for queries, and other general characteristics for Mongoose document properties. You can think of a Mongoose schema as the configuration object for a Mongoose model. A SchemaType is then a configuration object for an individual property. A SchemaType says what type a given path should have, whether it has any getters/setters, and what values are valid for that path."
*/

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },                       // instanceof mongoose.Schema.Types.String;
  date: { type: Date, required: true },                         // instanceof mongoose.Schema.Types.Date;
  calendarId: { type: mongoose.Schema.Types.ObjectId, ref: 'calendars', required: true },
});


/* Quoted explanations from https://mongoosejs.com/docs/schematypes.html and https://medium.com/

"An ObjectId is a special type typically used for unique identifiers. ObjectId is a class, and ObjectIds are objects. However, they are often represented as strings.
Schema.Types.ObjectId is used inside your Mongoose schema definitions to specify that a field will hold a reference to another document’s _id (i.e., an ObjectId).
It’s part of the schema definition and doesn’t have the extra methods provided by mongoose.Types.ObjectId.  In simple terms, mongoose.Types.ObjectId is more like a utility for manipulating ObjectId values, while Schema.Types.ObjectId is used to define relationships between documents."
*/

// "ref:" allows for referencing the exported "calendars" from the "calendarSchema" function within the models/calendars.js file


module.exports = mongoose.model("events", eventSchema);