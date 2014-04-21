/*!
 * pinata - sio_routes.js
 * Copyright(c) 2013
 * Author: karen <karenpenglabs@gmail.com>
 */

'use strict';
var restartCounter = 0;

var nickNames = [
  'Sunset',
  'Peewee',
  'Skeeter',
  'Limberleg',
  'Two - Bits',
  'Hunky - Dory',
  'Hoot Owl',
  'Tumbleweed',
  'Swayback',
  'Wild - Cat',
  'Bean - Belly',
  'Never Sweat',
  'Iron Jaw',
  'Rockin - Chair',
  'Razorback',
  'Jack - Rabbit',
  'Four - Ace',
  'The Rambler',
  'Snake Eye',
  'Gray Wonder',
  'Puddin’ - Foot',
  'Bootjack',
  'Mountain Sprout'
];
var nameIndex = 0;

var colorChoice = [
  0x3300ff,
  0xff0022,
  0x44aa33,
  0x33ff33,
  0xaaff00,
  0x2200ff,
  0x44aa33,
  0x33bb33,
  0xcc5522,
  0xaaaa33,
  0x4422ee,
  0xddcc44,
  0x22bb00,
  0xcc33bb,
  0x33ccbb,
  0xccaa66,
  0xaaeebb,
  0x123456
];
var colorIndex = 0;

var laptopId = [];
var mobileId = [];
var pinataLoc = [];
for (var i = 0; i < 5; i++) {
  pinataLoc.push([Math.round(Math.random() * 20) * 2 + 26, Math.round(Math.random() *
    20) * 2 - 14]);
}

//simple example
module.exports = function (sio) {
  var pageOpen = 0;
  sio.sockets.on('connection', function (socket) {
    pageOpen++;
    socket.emit('init', true);

    socket.on('disconnect', function () {
      pageOpen--;
      for (var i = 0; i < laptopId.length; i++) {
        if (laptopId[i] === socket.id) {
          laptopId.splice(i, 1);
        }
      }
      for (var j = 0; j < mobileId.length; j++) {
        if (mobileId[j] === socket.id) {
          mobileId.splice(j, 1);
        }
      }
      laptopId.forEach(function (id) {
        sio.sockets.socket(id).emit('killCube', socket.id);
      });
    });

    socket.on('deviceData', function (data) {
      if (!data) {
        laptopId.push(socket.id);
        sio.sockets.socket(socket.id).emit('pinataLoc', pinataLoc);
      } else {
        mobileId.push(socket.id);
        var mobileCube = {
          id: socket.id,
          x: Math.round(Math.random() * 20) * 2 + 26,
          y: Math.round(Math.random() * 20) * 2 - 14,
          c: colorChoice[colorIndex]
        };
        sio.sockets.socket(socket.id).emit('yourColor', colorIndex);
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

    socket.on('levelData', function (data) {
      sio.sockets.socket(data.id).emit('yourLevel', data.level);
    });

    socket.on('summonTData', function (data) {
      sio.sockets.socket(data.id).emit('yourSummonTData', data.times);
    });

    socket.on('scoreData', function (data) {
      restartCounter = 0;
      sio.sockets.socket(data.id).emit('yourScoreData', data.score);
    });

    function restartServer() {
      pinataLoc = [];
      nameIndex = 0;
      colorIndex = 0;
      for (var i = 0; i < 5; i++) {
        pinataLoc.push([Math.round(Math.random() * 20) * 2 + 26, Math.round(
          Math.random() *
          20) * 2 - 14]);
      }
      laptopId.forEach(function (id) {
        sio.sockets.socket(id).emit('pinataLoc', pinataLoc);
      });
      mobileId.forEach(function (item) {
        var mobileCube = {
          id: item,
          x: Math.round(Math.random() * 20) * 2 + 26,
          y: Math.round(Math.random() * 20) * 2 - 14,
          c: colorChoice[colorIndex]
        };
        sio.sockets.socket(item).emit('yourColor', colorIndex);
        colorIndex++;
        if (colorIndex > colorChoice.length - 1) {
          colorIndex = 0;
        }
        laptopId.forEach(function (item) {
          sio.sockets.socket(item).emit('makeCube', mobileCube);
        });
        mobileId.forEach(function (item) {
          sio.sockets.socket(item).emit('startOver', true);
        });
      });
    }

    socket.on('restartData', function () {
      if (restartCounter === 0) {
        restartServer();
        restartCounter = 1;
        setTimeout(function () {
          restartCounter = 0;
        }, 5000);
      }
    });

  });

};