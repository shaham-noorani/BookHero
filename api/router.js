const authController = require('./auth/auth.controller');
const userController = require('./users/user.controller');
const express = require('express');
const jwt = require('express-jwt');
const router = express.Router();

const auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload',
});

// profile
router.get('/profile', auth, userController.getUser);

// authentication
router.post('/register', authController.register);
router.post('/login', authController.login);

// health
router.get('/health', (req, res) => {
  res.send('Server is up :)');
});

module.exports = router;
