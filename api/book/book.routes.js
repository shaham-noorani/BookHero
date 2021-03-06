var express = require('express');
const router = express.Router();
var controller = require('./book.controller');

router.get('/', controller.searchForBooks);
router.get('/:volumeId', controller.getBookById);

module.exports = router;
