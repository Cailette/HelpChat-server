var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
const mongoose = require('./Database/database');

var app = express();

// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');
 
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routers 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var workHoursRouter = require('./routes/workHours');
var visitorsRouter = require('./routes/visitors');
var chatsRouter = require('./routes/chats');

require('dotenv').config();
app.set('secretKey', 'HelpChatRestApi'); 

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use((req, res, next) => {
  var allowedOrigins = ['http://localhost:4200', 'http://localhost:4000', 'http://localhost:5000'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.append('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.append("Access-Control-Allow-Headers", "Origin, Accept, Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, x-access-token");
  res.append('Access-Control-Allow-Credentials', true);
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/work-hours', workHoursRouter);
app.use('/visitors', visitorsRouter);
app.use('/chats', chatsRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
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
