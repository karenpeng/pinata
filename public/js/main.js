(function (exports) {

  var windowWidth = window.innerWidth;
  $('#myCanvas').width(windowWidth);
  $('#myCanvas').height(windowWidth * 9 / 16);
  var canvas = document.getElementById('myCanvas');
  canvas.setAttribute('width', windowWidth);
  canvas.setAttribute('height', windowWidth * 9 / 16);

  var mgl = -windowWidth / 2;
  var mglS = mgl.toString();
  $('#myCanvas').css('margin-left', mglS);
  var w = $("#myCanvas").width();
  var h = $("#myCanvas").height();

  var context = canvas.getContext('2d');
  var imgObj = new Image();
  imgObj.src = "http://lab.dxtr.com/pinata/pinatamap.png";

  exports.point = new obelisk.Point(0, 0);
  exports.pixelView = new obelisk.PixelView(canvas, point);

  var pinatas = [];
  var cubes = [];
  var init = false;
  var overCount = 0;
  $("#explode").show();

  function restart() {
    $("#explode").hide();
    pinatas = [];
    cubes = [];
    socket.emit('restartData', true);
  }

  function draw(foo, rate) {
    setTimeout(function () {
      requestAnimationFrame(function () {
        draw(foo, rate);
      });
      foo();
    }, 1000 / rate);
  }

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
        item.render();
      });

      cubes.forEach(function (item) {
        item.render();
      });

    }
    if (init && pinatas.length === 0) {
      // context.drawImage(imgObj, 0, 0, w, h);
      // for (var i = 0; i < 5; i++) {
      //   context.beginPath();
      //   context.rect(0, 0, w, h);
      //   context.fillStyle = 'rgba(225,225,225,0.4)';
      //   context.fill();
      // }
      // $('.blurCanvas').blurjs({
      //   overlay: 'rgba(255,255,255,0.8)'
      // });
      overCount++;
      //if (overCount > 8) {
      $("#explode").show();
      //}
      if (overCount > 8) {
        restart();
        overCount = 0;
        init = false;
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

})(this);