/*!
 * pinata - sio_routes.js
 * Copyright(c) 2013
 * Author: karen <karenpenglabs@gmail.com>
 */

'use strict';

var laptopId = [];
var pinataX = Math.round(Math.random() * 18) * 2 + 10;
var pinataY = Math.round(Math.random() * 18) * 2 - 6;
var colorChoice = [
  0x3300ff,
  0xff0022,
  0x44aa33,
  0x33ff33,
  0xaaff00,
  0x2200ff
];
var colorIndex = 0;
var serverCubes = [];

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
      var pinata = {
        x: pinataX,
        y: pinataY
      };
      if (!data) {
        laptopId.push(socket.id);
        sio.sockets.socket(socket.id).emit('pinata', pinata);
      } else {
        var mobileCube = {
          id: socket.id,
          x: Math.round(Math.random() * 18) * 2 + 10,
          y: Math.round(Math.random() * 18) * 2 - 6,
          c: colorChoice[colorIndex]
        };
        colorIndex++;
        if (colorIndex > colorChoice.length - 1) {
          colorIndex = 0;
        }
        laptopId.forEach(function (item) {
          sio.sockets.socket(item).emit('makeCube', mobileCube);
        });
      }

    });

    socket.on('lrData', function (data) {

      laptopId.forEach(function (id) {
        var moveLR = {
          id: socket.id,
          info: data
        };
        sio.sockets.socket(id).emit('otherLR', moveLR);
      });

    });

    socket.on('fbData', function (data) {
      laptopId.forEach(function (id) {
        var moveFB = {
          id: socket.id,
          info: data
        };
        sio.sockets.socket(id).emit('otherFB', moveFB);
      });
    });

    socket.on('shakeData', function (data) {
      laptopId.forEach(function (item) {
        var otherShake = {
          id: socket.id,
          dig: data
        };
        sio.sockets.socket(item).emit('otherShake', otherShake);
      });
    });

    socket.on('explore', function () {
      laptopId.forEach(function (item) {
        sio.sockets.socket(item).emit('otherExplore', socket.id);
      });
    });

    socket.on('summon', function () {
      laptopId.forEach(function (item) {
        sio.sockets.socket(item).emit('otherSummon', socket.id);
      });
    });

    socket.on('disData', function (data) {

    });

  });

};