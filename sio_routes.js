/*!
 * pinata - sio_routes.js
 * Copyright(c) 2013
 * Author: karen <karenpenglabs@gmail.com>
 */

'use strict';

var laptopId = [];
//simple example
module.exports = function (sio) {
  var pageOpen = 0;
  sio.sockets.on('connection', function (socket) {
    pageOpen++;
    socket.emit('init', pageOpen);

    socket.broadcast.emit('in', pageOpen);

    socket.on('disconnect', function () {
      pageOpen--;
      socket.broadcast.emit('leave', pageOpen);
      if (pageOpen === 0) {
        laptopId = [];
      }
    });

    socket.on('deviceData', function (data) {
      if (!data.device) {
        laptopId.push(socket.id);
      }
    });

    socket.on('lrData', function (data) {
      laptopId.forEach(function (id) {
        sio.sockets.socket(id).emit('otherLR', data);
      });
    });

    socket.on('fbData', function (data) {
      laptopId.forEach(function (id) {
        sio.sockets.socket(id).emit('otherFB', data);
      });
    });

  });
};