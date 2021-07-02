var express = require('express');
const router = express.Router();

var controller = require('./auth.controller');

router.post('/register', controller.register);
router.post('/login', controller.login);

module.exports = router;
