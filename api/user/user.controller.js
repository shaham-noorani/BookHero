const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports.getUser = (req, res) => {
  // if no user ID exists in the JWT, return a 401
  if (!req.payload._id) {
    res.status(401).json({
      message: 'UnauthorizedError: private user',
    });
  }

  // Otherwise continue
  else {
    User.findById(req.payload._id).exec((err, user) => {
      res.status(200).json(user);
    });
  }
};
