const express = require('express');
const bodyParser = require('body-parser');
const HttpStatus = require('http-status-codes')
const cors = require('cors')

const user = require('./routes/user');
const signin = require('./routes/signin');
const signup = require('./routes/signup');
const photo = require('./routes/photo');

require('dotenv').config()

const app = express();
app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/users', user);
app.use('/api/signin', signin)
app.use('/api/signup', signup)
app.use('/api/photos', photo)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
