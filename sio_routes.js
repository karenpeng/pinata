/*!
 * pinata - sio_routes.js
 * Copyright(c) 2013
 * Author: karen <karenpenglabs@gmail.com>
 */

'use strict';
var Record = require('./models/record');
var restartCounter = 0;
var winner = 0;
var winnerCount = 0;

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
for (var i = 0; i < 3; i++) {
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

    socket.on('empty', function (data) {
      sio.sockets.socket(data).emit('yourEmpty', true);
    });

    function restartServer() {
      pinataLoc = [];
      winner = 0;
      winnerCount = 0;
      nameIndex = 0;
      colorIndex = 0;
      for (var i = 0; i < 3; i++) {
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

    socket.on('submitName', function (data) {
      winner = data.length;
      data.forEach(function (id) {
        sio.sockets.socket(id).emit('submitYourName', true);
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

    /**
     * 获取所有的records记录
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
    */
    socket.on('addRecord', function (data) {
      var record = new Record();
      record.name = data.name;
      record.score = parseInt(data.score, 10);
      record.save(function () {
        winnerCount++;
        if (winnerCount >= winner) {
          var query = {};
          var select = 'name score';
          var options = {
            limit: 10, // 只取前十个
            sort: {
              score: -1
            }, // 按照分数排序, -1 表示倒序（从大到小）
          };
          Record.find(query, select, options, function (err, data) {
            if (err) {
              return err;
            }
            laptopId.forEach(function (id) {
              sio.sockets.socket(id).emit('recordDone', data);
            });
          });
        }
      });

    });

    /**
     * 删除全部记录

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
   */
  });

};