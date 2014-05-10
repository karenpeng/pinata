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

//mongoose
var mongoose = require('mongoose');
mongoose.connect(
  'mongodb://karenpunkpunk:happiness_first@ds031627.mongolab.com:31627/pinata_score'
);
var Record = require('./models/record');

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

//from dead horse
/**
 * 获取所有的records记录
 */
app.get('/records', function (req, res, next) {
  // 查询看文档 http://mongoosejs.com/docs/queries.html
  // 第一个参数是查询条件，第二个参数是要查询需要获得的属性
  Record.find({}, 'name score', function (err, data) {
    if (err) {
      return next(err);
    }
    // 得到一个数组
    res.send(data);
  });
});

/**
 * 查询top 3
 */
app.get('/records/top', function (req, res, next) {
  // 查询条件
  // 获取全部
  // query = {}
  // 获取指定用户
  // query = {name: 'dead_horse'}
  var query = {};

  // 要取的字段
  var select = 'name score';

  // 查询的一些选项
  var options = {
    limit: 3, // 只取前三个
    sort: {
      score: -1
    }, // 按照分数排序, -1 表示倒序（从大到小）
  };
  Record.find(query, select, options, function (err, data) {
    if (err) {
      return next(err);
    }
    res.send(data);
  });
});

/**
 * 增加一个records
 * http://localhost:7001/records/add?name=dead_horse&score=123
 */
app.get('/records/add', function (req, res, next) {
  // 获得参数
  var query = req.query;
  if (!query.name) {
    return res.send('need name');
  }
  if (!query.score) {
    return res.send('need score');
  }
  // 新建一条record
  var record = new Record();
  record.name = query.name;
  record.score = parseInt(query.score, 10);
  record.save();
  res.send('saved');
});

/**
 * 删除全部记录
 */
app.get('/records/clean', function (req, res, next) {
  // 第一个参数是查询条件，删除满足这个条件的所有record
  // {} 就会删除全部
  Record.remove({}, function (err, data) {
    if (err) {
      return next(err);
    }
    res.send('clean done');
  });
});

app.listen(7002);