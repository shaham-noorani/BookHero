const express = require('express');
const router = express.Router();

const authRouter = require('./auth/auth.router');
const userRouter = require('./user/user.routes');
const bookRouter = require('./book/book.routes');

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/books', bookRouter);

module.exports = router;
