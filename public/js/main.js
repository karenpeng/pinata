var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var imgObj = new Image();
imgObj.src = "/public/image/pinatamap.png";

var point = new obelisk.Point(0, 0);
var pixelView = new obelisk.PixelView(canvas, point);

var scale = 1;
var cubeSize = 12 * scale;
var trackSize = 12 * scale;

var cubes = [];
var bricks = [];

function cuteBrick(a, b) {
  this.a = a;
  this.b = b;
  this.brickColor = new obelisk.SideColor(0x000000, 0x77b19c84);
  this.dimension = new obelisk.BrickDimension(trackSize, trackSize);
  this.brick = new obelisk.Brick(this.dimension, this.brickColor, false);
}

cuteBrick.prototype = {
  render: function () {
    this.p3dBrick = new obelisk.Point3D(this.a * (trackSize - 2), this.b *
      (trackSize - 2),
      0);
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
  this.dis;
  this.preDis = 10000000000000;
  this.explore = true;
  this.summon = false;
  this.myBricks = [];
  this.c = c;
  this.originalC = this.c;
  this.cubeDms = new obelisk.CubeDimension(cubeSize, cubeSize, cubeSize);
  this.cubeColor = new obelisk.CubeColor().getByHorizontalColor(this.c);
  this.cube = new obelisk.Cube(this.cubeDms, this.cubeColor, false);
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
    }
    if (this.dig) {
      this.z++;
      if (this.z > 1) {
        this.z = 0;
      }
    } else {
      this.z = 0;
    }
    if (this.a < 20) this.a = 20;
    if (this.a > 80) this.a = 80;
    if (this.b < -10) this.b = -10;
    if (this.b > 60) this.b = 60;
  },
  check: function (x, y) {
    var gapX = this.a * (trackSize - 2) - x * (trackSize - 2);
    var gapY = this.b * (trackSize - 2) - y * (trackSize - 2);
    this.dis = Math.sqrt(Math.pow(gapX, 2) + Math.pow(gapY, 2));
    if (Math.abs(this.preDis - this.dis) > 20) {
      var disData = {
        id: this.id,
        dis: this.dis
      };
      socket.emit('disData', disData);
    }
  },
  render: function () {

    this.p3d = new obelisk.Point3D((trackSize - 2) * this.a, (trackSize - 2) *
      this.b, (trackSize - 2) * this.z);

    // if (!this.dig) {
    //   this.cubeColor = new obelisk.CubeColor().getByHorizontalColor(this.c);
    // } else {
    //   var c = obelisk.ColorPattern.getRandomComfortableColor();
    //   this.cubeColor = new obelisk.CubeColor().getByHorizontalColor(c);
    // }
    //this.cube = new obelisk.Cube(this.cubeDms, this.cubeColor, false);
    pixelView.renderObject(this.cube, this.p3d);
  },
  renderTrack: function () {
    this.myBricks.forEach(function (item) {
      item.render();
    });
  }
};

function drawBg() {
  context.beginPath();
  context.rect(0, 0, 1200, 700);
  context.fillStyle = '#ddd';
  context.fill();
  context.drawImage(imgObj, 0, 0, 1280, 720);
}

function setup() {

}

socket.on('pinata', function (data) {
  cubes.push(new cuteCube(data.x, data.y, obelisk.ColorPattern.PINK, 'pinata'));
});

function draw() {
  if (!mobile) {

    setTimeout(function () {
      drawBg();
      cubes.forEach(function (item) {
        item.track();
        item.move();
        item.renderTrack();
        item.check();
      });
      cubes.forEach(function (item) {
        item.render();
      });

      requestAnimationFrame(draw);
    }, 250);
  }
}

setup();
draw();

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