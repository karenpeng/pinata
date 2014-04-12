var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var point = new obelisk.Point(0, 0);
var pixelView = new obelisk.PixelView(canvas, point);
var colorChoice = [
  obelisk.ColorPattern.PINK,
  obelisk.ColorPattern.GRASS_GREEN,
  obelisk.ColorPattern.BLUE,
  obelisk.ColorPattern.YELLOW,
  obelisk.ColorPattern.GRAY,
  obelisk.ColorPattern.PUPPLE
];
var scale = 1;
var cubeSize = 24 * scale;
var trackSize = 12 * scale;
var colorIndex = 0;
var cubes = [];
var bricks = [];

function cuteBrick(a, b, c) {
  this.a = a;
  this.b = b;
  //this.c = obelisk.ColorPattern.GRAY;
  this.c = c;
  this.brickColor = new obelisk.SideColor().getByInnerColor(this.c);
  this.dimension = new obelisk.BrickDimension(trackSize, trackSize);
  this.brick = new obelisk.Brick(this.dimension, this.brickColor);
}

cuteBrick.prototype = {
  render: function () {
    this.p3dBrick = new obelisk.Point3D(this.a * trackSize, this.b * trackSize,
      0);
    this.brickColor = new obelisk.SideColor().getByInnerColor(this.c);
    pixelView.renderObject(this.brick, this.p3dBrick);
  }
};

function cuteCube(a, b, id) {
  this.a = a;
  this.b = b;
  this.id = id;
  this.right = 0;
  this.back = 0;
  this.preA = 0;
  this.preB = 0;
  this.dig = false;
  this.myBricks = [];
  this.c = colorChoice[colorIndex];
  this.originalC = this.c;
  this.cubeColor = new obelisk.CubeColor().getByHorizontalColor(this.c);
  this.cubeDms = new obelisk.CubeDimension(cubeSize, cubeSize, cubeSize);
  this.cube = new obelisk.Cube(this.cubeDms, this.cubeColor, false);
}

cuteCube.prototype = {
  track: function () {
    if (this.preA !== this.a || this.preB !== this.b) {
      this.myBricks.push(new cuteBrick(this.a, this.b, this.c));
      this.preA = this.a;
      this.preB = this.b;
    }
  },
  move: function () {
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
    if (this.a < 20) this.a = 20;
    if (this.a > 60) this.a = 60;
    if (this.b < -10) this.b = -10;
    if (this.b > 30) this.b = 30;
  },
  render: function () {
    this.p3d = new obelisk.Point3D(trackSize * this.a, trackSize * this.b, 0);
    this.cubeColor = new obelisk.CubeColor().getByHorizontalColor(this.c);
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
}

function setup() {
  // for (var i = 20; i <= 90; i++) {
  //   for (var j = -10; j <= 50; j++) {
  //     bricks.push(new cuteBrick(i, j, obelisk.ColorPattern.GRAY));
  //   }
  // }
}

function check() {
  for (var i = 1; i < cubes.length; i++) {
    var gapX = cubes[i].a * trackSize - cubes[0].a * trackSize;
    var gapY = cubes[i].b * trackSize - cubes[0].b * trackSize;
    var dis = Math.sqrt(Math.pow(gapX, 2) + Math.pow(gapY, 2));
    if (dis < 40) {
      cubes[i].c = obelisk.ColorPattern.BLACK;
      cubes[i].dig = true;
    } else {
      cubes[i].c = cubes[i].originalC;
      cubes[i].dig = false;
    }
  }
}

socket.on('pinata', function (data) {
  cubes.push(new cuteCube(data.x, data.y, 'pinata'));
  colorIndex++;
});

function draw() {
  if (!mobile) {

    setTimeout(function () {
      drawBg();
      // bricks.forEach(function (item) {
      //   item.render();
      // });
      cubes.forEach(function (item) {
        item.track();
        item.move();
        item.renderTrack();
      });
      cubes.forEach(function (item) {
        item.render();
      });

      check();

      requestAnimationFrame(draw);
    }, 120);
  }
}

setup();
draw();

socket.on('makeCube', function (data) {
  cubes.push(new cuteCube(data.x, data.y, data.id));
  colorIndex++;
  if (colorIndex > colorChoice.length - 1) {
    colorIndex = 0;
  }
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
      if (data.info >= -6 && data.info <= 6) {
        item.right = 0;
      } else if (data.info > 6) {
        item.right = 1;
      } else {
        item.right = 2;
      }
    }
  });
});
socket.on('otherFB', function (data) {
  cubes.forEach(function (item) {
    if (item.id === data.id) {
      if (data.info >= -6 && data.info <= 6) {
        item.back = 0;
      } else if (data.info > 6) {
        item.back = 1;
      } else {
        item.back = 2;
      }
    }
  });
});