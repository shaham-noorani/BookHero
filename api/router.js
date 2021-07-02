const express = require('express');
const router = express.Router();

const authRouter = require('./auth/auth.router');
const userRouter = require('./user/user.routes');

router.use('/user', userRouter);
router.use('/auth', authRouter);

module.exports = router;
