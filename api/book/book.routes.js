var express = require('express');
const router = express.Router();
var controller = require('./book.controller');

router.get('/', controller.getBooks);

module.exports = router;
