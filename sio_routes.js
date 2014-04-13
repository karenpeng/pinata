/*!
 * pinata - sio_routes.js
 * Copyright(c) 2013
 * Author: karen <karenpenglabs@gmail.com>
 */

'use strict';

var laptopId = [];
var mobileId = [];
var pinataX = Math.random() * 20 + 20;
var pinataY = Math.random() * 20;
var scale = 1;
var cubeSize = 24 * scale;
var trackSize = 12 * scale;

function serverCube(a, b, id) {
  this.a = a;
  this.b = b;
  this.id = id;
  this.right = 0;
  this.back = 0;
  this.myLocX;
  this.myLocY;
  this.dis;
}
serverCube.prototype = {
  update: function (lr, fb) {
    if (lr >= -6 && lr < 6) {
      this.right = 0;
    } else if (lr > 6) {
      this.right = 1;
    } else {
      this.right = 2;
    }
    if (fb >= -6 && fb < 6) {
      this.back = 0;
    } else if (fb > 6) {
      this.back = 1;
    } else {
      this.back = 2;
    }
  },
  walk: function () {
    if (this.right === 1) {
      this.a++;
    } else if (this.right === 2) {
      this.a--;
    }
    if (this.a < 20) this.a = 20;
    if (this.a > 60) this.a = 60;

    if (this.back === 1) {
      this.b++;
    } else if (this.back === 2) {
      this.b--;
    }
    if (this.b < -10) this.b = -10;
    if (this.b > 30) this.b = 30;
    this.myLocX = this.a * trackSize;
    this.myLocY = this.b * trackSize;
  },
  check: function () {
    var gapX = this.myLocX - pinataX * trackSize;
    var gapY = this.myLocY - pinataY * trackSize;
    this.dis = Math.sqrt(Math.pow(gapX, 2) + Math.pow(gapY, 2));
  }
};
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
      sio.sockets.socket(socket.id).emit('pinata', pinata);

      if (!data) {
        laptopId.push(socket.id);
      } else {
        mobileId.push(socket.id);

        var mobileCube = {
          id: socket.id,
          x: Math.random() * 20 + 20,
          y: Math.random() * 20
        };
        sio.sockets.socket(socket.id).emit('urLocation', mobileCube);
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

  });

};