require('dotenv').config();
require('./api/config/db');
require('./api/config/passport');

const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const passport = require('passport');
const path = require('path');

const router = require('./api/router');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.PROD) app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use('/api', router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Catch unauthorized errors
app.use((err, req, res) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({ message: `${err.name}: ${err.message}` });
  }
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Server started on port ' + port);
});

module.exports = app;
