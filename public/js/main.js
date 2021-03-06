(function (exports) {
  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');
  var imgObj = new Image();
  imgObj.src = "/public/image/pinatamap.png";

  exports.point = new obelisk.Point(0, 0);
  exports.pixelView = new obelisk.PixelView(canvas, point);

  var pinatas = [];
  var cubes = [];
  var init = false;
  var overCount = 0;
  var rankingDone = false;
  var tutorialOn = false;

  function restart() {
    pinatas = [];
    cubes = [];
    socket.emit('restartData', true);
    overCount = 0;
    init = false;
    rankingDone = false;
    $("#topThree").hide();
    $("#tutorial").show();
  }

  function draw(foo, rate) {
    setTimeout(function () {
      requestAnimationFrame(function () {
        draw(foo, rate);
      });
      foo();
    }, 1000 / rate);
  }

  $("#tutorial").click(function () {
    tutorialOn = !tutorialOn;
    if (tutorialOn) {
      $("#tutorial").html('Tutorial On');
    } else {
      $("#tutorial").html('Tutorial Off');
    }
  });

  draw(function () {
    if (init && pinatas.length > 0) {
      context.drawImage(imgObj, 0, 0, w, h);

      cubes.forEach(function (item) {
        item.track();
        item.move();
        item.renderTrack();
        item.check(pinatas);
        if (item.win()) {
          for (var i = 0; i < pinatas.length; i++) {
            if (pinatas[i].id === item.pinataId) {
              pinatas.splice(i, 1);
            }
          }
        }
      });

      pinatas.forEach(function (item) {
        if (tutorialOn) {
          item.render();
        }
      });

      cubes.forEach(function (item) {
        item.render();
      });

    }
    if (init && pinatas.length === 0) {
      //$("#explode").attr("src", "http://lab.dxtr.com/pinata/pinata.gif");
      // $('.blurCanvas').blurjs({
      //   overlay: 'rgba(255,255,255,0.8)'
      // });
      overCount++;
      if (overCount === 5) {
        $("#explode").attr("src", "/public/image/pinata.gif");
        $("#explode").show();
        var highScore = 0;
        var highScorePlayer = [];
        cubes.forEach(function (item) {
          if (item.score > highScore) {
            highScorePlayer = [];
            highScorePlayer.push(item.id);
            highScore = item.score;
          } else if (item.score === highScore) {
            highScorePlayer.push(item.id);
          }
        });
        socket.emit('submitName', highScorePlayer);
      } else if (overCount === 21) {
        context.drawImage(imgObj, 0, 0, w, h);
        $("#explode").removeAttr("src");
        $("#explode").hide();
        $("#gameOver").show();
      } else if (overCount > 21 && rankingDone) {
        $("#gameOver").hide();
        $("#topThree").show();
        $("#tutorial").hide();
      }
    }
  }, 4);

  socket.on('pinataLoc', function (data) {
    var i = 0;
    data.forEach(function (item) {
      pinatas.push(new pinata(item[0], item[1], i));
      i++;
    });
    init = true;
  });

  socket.on('makeCube', function (data) {
    cubes.push(new cuteCube(data.x, data.y, data.c, data.id));

  });

  socket.on('killCube', function (data) {
    for (var i = 0; i < cubes.length; i++) {
      if (cubes[i].id === data) {
        cubes.splice(i, 1);
      }
    }
  });

  socket.on('otherLR', function (data) {
    cubes.forEach(function (item) {
      if (item.id === data.id) {
        item.right = data.info;
      }
    });
  });
  socket.on('otherFB', function (data) {
    cubes.forEach(function (item) {
      if (item.id === data.id) {
        item.back = data.info;
      }
    });
  });

  socket.on('otherShake', function (data) {
    cubes.forEach(function (item) {
      if (item.id === data.id) {
        item.dig = data.dig;
      }
    });
  });

  socket.on('otherExplore', function (data) {
    cubes.forEach(function (item) {
      if (item.id === data) {
        item.explore = true;
        item.summon = false;
      }
    });
  });

  socket.on('otherSummon', function (data) {
    cubes.forEach(function (item) {
      if (item.id === data) {
        item.explore = false;
        item.summon = true;
      }
    });
  });

  socket.on('recordDone', function (data) {
    //append the data into topThree
    rankingDone = true;
    for (var i = 0; i < 10; i++) {
      if (data[i] !== undefined) {
        var arr1 = ["#name", i + 1];
        var nnd1 = arr1.join("");
        $(nnd1).html(data[i].name);
        var arr2 = ["#score", i + 1];
        var nnd2 = arr2.join("");
        $(nnd2).html(data[i].score);
      }
    }
  });

  $("#playAgain").click(function () {
    restart();
  });

})(this);