const mongoose = require('mongoose');
const { bookListEntrySchema } = require('../book/book.model');
const User = mongoose.model('User');
const Book = mongoose.model('Book');
const BookListEntry = mongoose.model('BookListEntry');

const { getBookByVolumeId } = require('../book/book.service');

module.exports.getMe = (req, res) => {
  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      message: 'UnauthorizedError: private profile',
    });
  }

  // Otherwise continue
  else {
    User.findById(req.payload._id).exec((err, user) => {
      res.status(200).json(user);
    });
  }
};

module.exports.addToBooklist = async (req, res) => {
  const volume = await getBookByVolumeId(req.query.volumeId);
  const volumeInfo = volume.data.volumeInfo;

  let bookObject = new Book({
    title: volumeInfo.title,
    author: volumeInfo.authors[0],
    pageCount: volumeInfo.pageCount,
    coverImage: volumeInfo.imageLinks.thumbnail,
    blurb: volumeInfo.description,
    categories: volumeInfo.categories
      ? volumeInfo.categories[0].split(' / ')
      : [],
    datePublished: Date.parse(volumeInfo.publishedDate),
  });

  let bookListEntry = new BookListEntry({
    volumeId: req.query.volumeId,
    status: req.body.status,
    book: bookObject,
    notes: req.body.notes ? req.body.notes : '',
    currentPageCount: req.body.currentPageCount ? req.body.currentPageCount : 0,
    rating: req.body.rating ? req.body.rating : 0,
    review: req.body.review ? req.body.review : '',
    startDate: req.body.startDate ? req.body.startDate : Date.now(),
    endDate: req.body.endDate ? req.body.endDate : Date.now() + 7,
  });

  User.updateOne(
    { _id: req.payload._id },
    {
      $addToSet: { bookList: [bookListEntry] },
    }
  ).exec((err, user) => {
    res.status(200).json(user);
  });
};

module.exports.removeFromBooklist = async (req, res) => {
  User.updateOne(
    { _id: req.payload._id },
    {
      $pull: { bookList: { volumeId: req.query.volumeId } },
    }
  ).exec((err, user) => {
    res.status(200).json(user);
  });
};

module.exports.updateBooklistEntry = async (req, res) => {
  User.updateOne(
    { _id: req.payload._id, 'bookList.volumeId': req.query.volumeId },
    {
      $set: { 'bookList.$': req.body },
    }
  ).exec((err, user) => {
    res.status(200).json(user);
  });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id).exec((err, user) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({
        name: user.name,
        _id: user._id,
        bookList: user.bookList,
        minutesPerPageRead: user.minutesPerPageRead,
      });
    }
  });
};
