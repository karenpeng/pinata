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

  var point = new obelisk.Point(0, 0);
  var pixelView = new obelisk.PixelView(canvas, point);

  var cubeSize = 14;
  var trackSize = cubeSize - 2;

  var pinataX, pinataY;

  var cubes = [];
  var bricks = [];
  var caught = 0;

  function cuteBrick(a, b) {
    this.a = a;
    this.b = b;
    this.brickColor = new obelisk.SideColor(0x000000, 0x77b19c84);
    this.dimension = new obelisk.BrickDimension(cubeSize, cubeSize);
    this.brick = new obelisk.Brick(this.dimension, this.brickColor, false);
  }

  cuteBrick.prototype = {
    render: function () {
      this.p3dBrick = new obelisk.Point3D(this.a * trackSize, this.b *
        trackSize, 0);
      pixelView.renderObject(this.brick, this.p3dBrick);
    }
  };

  function cuteCube(a, b, c, id) {
    this.a = a;
    this.b = b;
    this.z = 0;
    this.id = id;
    this.right = 0;
    this.back = 0;
    this.preA = 0;
    this.preB = 0;
    this.dig = false;
    this.level;
    this.preLevel;
    this.explore = true;
    this.summon = false;
    this.summonTimes = 0;
    this.myBricks = [];
    this.c = c;
    this.originalC = this.c;
    this.cubeDms = new obelisk.CubeDimension(cubeSize, cubeSize, cubeSize);
    this.cubeColor = new obelisk.CubeColor().getByHorizontalColor(this.c);
    this.cube = new obelisk.Cube(this.cubeDms, this.cubeColor, false);
    console.log(this.a, this.b);
  }

  cuteCube.prototype = {
    track: function () {
      if (this.preA !== this.a || this.preB !== this.b) {
        this.myBricks.push(new cuteBrick(this.a, this.b));
        this.preA = this.a;
        this.preB = this.b;
      }
    },
    move: function () {
      if (this.explore) {
        this.summonTimes = 0;
        if (this.right === 1) {
          this.a++;
        } else if (this.right === 2) {
          this.a--;
        }
        if (this.back === 1) {
          this.b++;
        } else if (this.back === 2) {
          this.b--;
        }
      } else if (this.summon) {
        if (this.dig) {
          this.z++;
          this.summonTimes++;
          var summonTData = {
            id: this.id,
            times: this.summonTimes
          };
          socket.emit('summonTData', summonTData);
          if (this.z > 1) {
            this.z = 0;
          }
        } else {
          this.z = 0;
        }
      }
      if (this.a < 20) this.a = 20;
      if (this.a > 100) this.a = 100;
      if (this.b < -30) this.b = -30;
      if (this.b > 50) this.b = 50;
    },
    check: function () {
      var gapX = this.a * trackSize - pinataX * trackSize;
      var gapY = this.b * trackSize - pinataY * trackSize;
      var dis = Math.sqrt(Math.pow(gapX, 2) + Math.pow(gapY, 2));
      if (dis < 60) this.level = 0;
      else if (dis < 120) this.level = 1;
      else if (dis < 200) this.level = 2;
      else if (dis < 300) this.level = 3;
      else if (dis < 440) this.level = 4;
      else if (dis < 600) this.level = 5;
      else this.level = 6;
      if (this.preLevel !== this.level) {
        var levelData = {
          id: this.id,
          level: this.level
        };
        socket.emit('levelData', levelData);
        this.preLevel = this.level;
      }
    },
    win: function () {
      if (this.summonTimes > 10 && this.level === 0) {
        over = true;
      }
    },
    render: function () {
      this.p3d = new obelisk.Point3D(trackSize * this.a, trackSize * this.b,
        trackSize * this.z);
      pixelView.renderObject(this.cube, this.p3d);
    },
    renderTrack: function () {
      this.myBricks.forEach(function (item) {
        item.render();
      });
    }
  };

  function draw() {
    if (!mobile) {
      if (caught < 6) {

        setTimeout(function () {
          context.drawImage(imgObj, 0, 0, 1280, 720);
          cubes.forEach(function (item) {
            item.track();
            item.move();
            item.renderTrack();
            item.check();
            item.win();
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

  socket.on('pinata', function (data) {
    cubes.push(new cuteCube(data.x, data.y, obelisk.ColorPattern.PINK,
      'pinata'));
    pinataX = data.x;
    pinataY = data.y;
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