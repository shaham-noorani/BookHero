const mongoose = require('mongoose');

const status = ['completed', 'dropped', 'on-hold', 'reading', 'plan to read'];

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  coverImage: {
    type: String,
    required: false,
  },
  blurb: {
    type: String,
    required: false,
    default: '',
  },
  mainCategory: {
    type: String,
  },
  datePublished: {
    type: Date,
    required: true,
  },
});

const bookListEntrySchema = new mongoose.Schema({
  volumeId: {
    type: String,
    required: true,
  },
  book: bookSchema,
  status: {
    type: String,
    enum: status,
    required: true,
    default: 'reading',
  },
  notes: {
    type: String,
    required: false,
  },
  currentPageCount: {
    type: Number,
    required: false,
    default: () => {
      if (this.status == 'completed') return this.book.pageCount;
      else return 0;
    },
  },
  rating: {
    type: Number,
    required: false,
  },
  review: {
    type: String,
    required: false,
  },
  startDate: {
    type: Date,
    required: false,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: false,
  },
});

module.exports.bookListEntrySchema = bookListEntrySchema;
