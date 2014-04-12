/*!
 * pinata - sio_routes.js
 * Copyright(c) 2013
 * Author: karen <karenpenglabs@gmail.com>
 */

'use strict';

var laptopId = [];
var mobileId = [];
var pinataX, pinataY;
//simple example
module.exports = function (sio) {
  var pageOpen = 0;
  sio.sockets.on('connection', function (socket) {
    pageOpen++;
    socket.emit('init', true);

    socket.on('disconnect', function () {
      pageOpen--;
      if (pageOpen === 0) {
        laptopId = [];
      }
      laptopId.forEach(function (id) {
        sio.sockets.socket(id).emit('killCube', socket.id);
      });
    });

    socket.on('deviceData', function (data) {
      if (!data) {
        laptopId.push(socket.id);
      } else {
        mobileId.push(socket.id);
      }
    });

    socket.on('pinata', function (data) {
      pinataX = data.x;
      pinataY = data.y;
    });

    socket.on('initXY', function (data) {
      var pinataOh = {
        x: pinataX,
        y: pinataY
      };
      sio.sockets.socket(socket.id).emit('pinataOh', pinataOh);
      laptopId.forEach(function (item) {
        var makeCube = {
          id: socket.id,
          x: data.x,
          y: data.y
        };
        sio.sockets.socket(item).emit('makeCube', makeCube);
      });
    });

    // socket.on('lrData', function (data) {
    //   laptopId.forEach(function (id) {
    //     var moveLR = {
    //       id: socket.id,
    //       info: data
    //     };
    //     sio.sockets.socket(id).emit('otherLR', moveLR);
    //   });
    // });

    // socket.on('fbData', function (data) {
    //   laptopId.forEach(function (id) {
    //     var moveFB = {
    //       id: socket.id,
    //       info: data
    //     };
    //     sio.sockets.socket(id).emit('otherFB', moveFB);
    //   });
    // });

  });
};