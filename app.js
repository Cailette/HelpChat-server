require('dotenv').config({path: __dirname + '/.env'})
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
const mongoose = require('./Database/database');
const cors = require("cors");

var app = express();
app.use(cors());

var indexRouter = require('./routes/index');
var statisticsRouter = require('./routes/statistics');
var usersRouter = require('./routes/users');
var workHoursRouter = require('./routes/workHours');
var visitorsRouter = require('./routes/visitors');
var chatsRouter = require('./routes/chats');
var mailRouter = require('./routes/mail');

require('dotenv').config();
// app.set('secretKey', 'HelpChatRestApi'); 

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/statistics', statisticsRouter);
app.use('/users', usersRouter);
app.use('/work-hours', workHoursRouter);
app.use('/visitors', visitorsRouter);
app.use('/chats', chatsRouter);
app.use('/mail', mailRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  console.log(err);
  if(err.status === 404)
      res.status(404).json({message: "Not found"});
  else 
      res.status(500).json({message: "Something looks wrong :( !!!"});
});

module.exports = app;
