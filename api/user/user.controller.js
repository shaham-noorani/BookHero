const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports.getUser = (req, res) => {
  // If no user ID exists in the JWT return a 401
  console.log(req.payload);
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

module.exports.addToBooklist = (req, res) => {
  const volumeId = req.body;
  console.log(req.body);
};
