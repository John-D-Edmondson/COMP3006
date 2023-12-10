const { mongoose } = require("mongoose");


// Define the Book schema
const bookSchema = new mongoose.Schema({
    bookID: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    blurb: {
      type: String,
      required: true,
    },
    genres: {
      type: [String],
      required: true,
    },
    borrowed: {
      type: Boolean,
      required: true,
    },
    dateBorrowed: {
      type: String,
      required: false,
    },
    dateReturned: {
      type: String,
    },
    borrowerID: {
      type: String,
    },
  });
  
  // Create and export the Book model
  const Book = mongoose.model('Book', bookSchema);
  module.exports = Book;