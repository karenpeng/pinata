(function (exports) {

  var windowWidth = window.innerWidth;
  $('canvas').width(windowWidth);
  $('canvas').height(windowWidth * 9 / 16);
  var mgl = -windowWidth / 2;
  var mglS = mgl.toString();
  $('canvas').css('margin-left', mglS);

  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');
  var imgObj = new Image();
  imgObj.src = "/public/image/2560Map-Grid.png";

  exports.point = new obelisk.Point(0, 0);
  exports.pixelView = new obelisk.PixelView(canvas, point);

  var pinatas = [];
  var cubes = [];
  var bricks = [];
  exports.caught = 0;

  function restart() {

  }

  function draw() {
    if (!mobile) {
      if (caught < 6) {

        setTimeout(function () {
          context.drawImage(imgObj, 0, 0, 1280, 720);

          cubes.forEach(function (item) {
            item.track();
            item.move();
            item.renderTrack();
            item.check(pinatas);
            item.win();
          });

          pinatas.forEach(function (item) {
            item.render();
          });

          cubes.forEach(function (item) {
            item.render();
          });
          requestAnimationFrame(draw);
        }, 250);
      }
    }
  }

  draw();

  socket.on('pinataLoc', function (data) {
    var i = 0;
    data.forEach(function (item) {
      pinatas.push(new pinata(item[0], item[1], i));
      i++;
    });
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