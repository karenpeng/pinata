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
  /* green */
  0x1abc9c,

  /* yellow */
  0xf1c40f,

  /* rust */
  0xd35400,

  /* dark green */
  0x27ae60,

  /* dark blue */
  0x006CB7,

  /* light blue */
  0x3498db,

  /* violet */
  0x8e44ad,

  /* brick */
  0xe74c3c,

  /* peach */
  0xF47E43,

  /* dark violet */
  0x752763,

  /* dull green */
  0x4D947A,

  /* raspberry */
  0xDA4952,

  /* navy blue */
  0x2E4DA7

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
        laptopId.forEach(function (item) {
          sio.sockets.socket(item).emit('makeCube', mobileCube);
        });
        mobileId.forEach(function (item) {
          sio.sockets.socket(item).emit('startOver', true);
        });
        sio.sockets.socket(item).emit('yourColor', colorIndex);
        colorIndex++;
        if (colorIndex > colorChoice.length - 1) {
          colorIndex = 0;
        }
      });
    }

    socket.on('submitScore', function () {
      mobileId.forEach(function (id) {
        sio.sockets.socket(id).emit('submitYourScore', true);
      });
    });

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