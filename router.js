const authController = require('./api/auth/auth.controller');
const userController = require('./api/user/user.controller');

const express = require('express');
const jwt = require('express-jwt');

const auth = jwt({
  secret: process.env.MY_SECRET,
  userProperty: 'payload',
  algorithms: ['RS256'],
});

const router = express.Router();

// profile
router.get('/profile/', auth, userController.getUser);

// authentication
router.post('/register', authController.register);
router.post('/login', authController.login);

// server health
router.get('/health', (req, res) => {
  res.send('Server is up :)');
});

module.exports = router;
