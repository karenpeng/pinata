/*!
 * pinata - app.js
 * Copyright(c) 2013
 * Author: karen <karenpenglabs@gmail.com>
 */

'use strict';

/**
 * Module dependencies.
 */

require('response-patch');
var http = require('http');
var path = require('path');
var connect = require('connect');
var render = require('connect-render');
var urlrouter = require('urlrouter');
//socket.io
var SocketIO = require('socket.io');
var sioRoutes = require('./sio_routes');

var config = require('./config');
var routes = require('./routes');

var mongoose = require('mongoose');
mongoose.connect(
  'mongodb://heroku_app23913158:l6djlr6sk6q3uqd51trirsgq62@ds031117.mongolab.com:31117/heroku_app23913158'
);

var PUBLIC_DIR = path.join(__dirname, 'public');

var app = connect();

app.use('/public', connect.static(PUBLIC_DIR));
app.use(function (req, res, next) {
  res.req = req;
  next();
});

//parse http get params
app.use(connect.query());

//parse http post body
app.use(connect.urlencoded());
app.use(connect.json({
  strict: true
}));

//parse cookie
app.use(connect.cookieParser());

//session
app.use(connect.session({
  key: config.sessionCookie,
  secret: config.sessionSecret,
  cookie: {
    path: '/',
    httpOnly: true
  },
}));

//handle csrf, do not open it when
if (process.env.NODE_ENV !== 'test') {
  app.use(connect.csrf());
}

/**
 * res.render helpers
 */
var helpers = {
  config: config,
  csrf: function (req) {
    return req.csrfToken ? req.csrfToken() : '';
  }
};

app.use(render({
  root: path.join(__dirname, 'views'),
  viewExt: '.html',
  layout: 'layout',
  cache: config.viewCache,
  helpers: helpers
}));

/**
 * Web site URL routing
 */
app.use(urlrouter(routes));

/**
 * Error handler
 */
app.use(function (err, req, res, next) {
  err.url = err.url || req.url;
  console.error(err);
  console.error(err.stack);
  if (config.debug) {
    return next(err);
  }
  res.statusCode = 500;
  res.send('Server has some problems. :(');
});

var server = module.exports = http.createServer(app);
var sio = SocketIO.listen(server);
sioRoutes(sio);