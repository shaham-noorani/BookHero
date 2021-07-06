const { NotExtended } = require('http-errors');
const mongoose = require('mongoose');
const User = mongoose.model('User');

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
      console.log(user);
      res.status(200).json(user);
    });
  }
};

module.exports.addToBooklist = (req, res) => {
  const volumeId = req.body;
  console.log(volumeId);
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
