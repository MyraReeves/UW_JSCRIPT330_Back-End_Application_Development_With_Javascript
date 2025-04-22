const mongoose = require('mongoose');
const Author = require('./author');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String },
  ISBN: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: Author, required: true },
  blurb: { type: String },
  publicationYear: { type: Number, required: true },
  pageCount: { type: Number, required: true }
});

// Implementing text indexes for search purposes:
bookSchema.index({ title: "text", genre: "text", blurb: "text"});

// Implementing an index for filtering by authorId:
bookSchema.index({ authorId: 1 });

// Implementing an index for filtering by the publication year:
bookSchema.index({ publicationYear: 1 });

// Implementing an index for filtering by the number of pages in a book:
bookSchema.index({ pageCount: 1 });

// Implementing a unique index on ISBN for exact match lookups:
bookSchema.index({ ISBN: 1 }, { unique: true });



module.exports = mongoose.model("books", bookSchema);





/* EXPLANATION FROM COURSE SLIDES (this is mostly a direct quote): 

Indexes help Mongo find things faster based on a specified field. If an appropriate index exists for a query, MongoDB can use the index to limit the number of documents it must inspect. Mongo uses additional memory to store a mapping of indexed values to where those documents are in storage. This pre-processing allows Mongo to use the stored map to go directly to the matching document(s) rather than scanning the whole collection. We must declare indexes manually, ahead of time. Indexes make reading by a particular field faster, at the expense of longer write time. Indexes are sorted according to the order in your creation command.

db.users.createIndex({ userId: 1 }) 
creates it in ascending order.

At times we may want an index on a commonly searched field that groups documents together.  For example: user language, gender, etc.  At other times we may want an index on a field that uniquely identifies a document.  For example: userId.  In this latter case, we don’t want to allow repeats.

Unique Indexes:
We can create an index and tell MongoDB that the field needs to be unique. The index allows Mongo to quickly detect conflicts. This protects against duplicates automatically. By default, this is done for _id

Compound Indexes:
A compound index allows us to build an index using multiple fields.  MongoDB will only use one index per query.

Unique Compound Indexes:
You can also declare that a combination of fields must be unique.  This is useful for field values that might be repeated but should only appear once in combination.  For example, to index city and state combinations we would use:
db.locations.createIndex({ city: 1, state: 1 }, { unique: true })

Text Index:
Text indexes are a special kind of index to support text searching.  Basically, it is a search engine that can consider multiple fields and allows you to find documents in order of the best match. You specify text fields that are relevant to someone trying to find matching (or partially-matching) text somewhere in a document.  For example, consider a collection of books. The text fields might be: title, genre, and subject.  Then the code to use would be:
db.books.createIndex({ title: "text", genre: "text", subject: "text" })
db.books.find(
 { $text: { $search: "Fantasy wizards" } }, 
 { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } })

*/


/* FURTHER EXPLANATIONS QUOTED FROM THE INTERNET:

Text Index:
Text search indexes are designed for natural language text — words that users might type to find relevant content.  This touches on practical search behavior. Text indexes are optimized for relevance scoring, not exact lookup. MongoDB’s $text search scores and ranks documents by relevance. Text indexes are limited. You can only have one text index per collection (in most versions of MongoDB). So, if you're not using it in text queries, it's better to leave it out and keep the index lean and focused.  However, search quality, performance, and result order won’t be affected by parameter field order because MongoDB’s text indexes treat all indexed fields as one large virtual string for searching and scoring purposes.

Compound Indexes:
MongoDB compound indexes are useful only when your queries match the prefix of the index. That means...
        bookSchema.index({ authorId: 1, publicationYear: 1 });
...would optimize for user queries that include BOTH the authorId and the year, such as...
        Book.find({ authorId: 5, publicationYear: 1985 });
...but would NOT work for user queries that use ONLY the year, such as:
        Book.find({ publicationYear: 1985 });
NOTE:  The compound index ({ authorId: 1, publicationYear: 1 }) WOULD still work fine if users primarily search by authorId with only OCCASIONAL inclusion of the year, since the year is the SECOND listed parameter in the compound index. 
*/