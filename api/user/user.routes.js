var express = require('express');
const router = express.Router();
const jwt = require('express-jwt');

var controller = require('./user.controller');

const auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload',
});

router.get('/', auth, controller.getUser);
router.post('/add-to-booklist', controller.addToBooklist);

module.exports = router;
