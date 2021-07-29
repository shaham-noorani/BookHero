var express = require('express');
const router = express.Router();
const jwt = require('express-jwt');

var controller = require('./user.controller');

const auth = jwt({
  secret: process.env.APP_SECRET,
  userProperty: 'payload',
});

// current user actions
router.get('/me', auth, controller.getMe);
router.post('/add-to-booklist', auth, controller.addToBooklist);
router.post('/add-friend', auth, controller.addFriend);
router.put('/update-booklist-entry', auth, controller.updateBooklistEntry);
router.post('/set-friend-code', auth, controller.setFriendCode);
router.delete('/remove-from-booklist', auth, controller.removeFromBooklist);

// non auth user actions
router.get('/:id', controller.getUser);

module.exports = router;
