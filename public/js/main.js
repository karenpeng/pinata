var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var point = new obelisk.Point(0, 0);
var pixelView = new obelisk.PixelView(canvas, point);
var colorChoice = [
  obelisk.ColorPattern.PURPLE,
  obelisk.ColorPattern.GRASS_GREEN,
  obelisk.ColorPattern.YELLOW,
  obelisk.ColorPattern.BLUE,
  obelisk.ColorPattern.GRAY,
  obelisk.ColorPattern.PINK
];
var size = 14;
var colorIndex = 0;
var cubes = [];
var bricks = [];

function cuteBrick(a, b, c) {
  this.a = a;
  this.b = b;
  //this.c = obelisk.ColorPattern.GRAY;
  this.c = c;
  this.brickColor = new obelisk.SideColor().getByInnerColor(this.c);
  this.dimension = new obelisk.BrickDimension(size, size);
  this.brick = new obelisk.Brick(this.dimension, this.brickColor);
}

cuteBrick.prototype = {
  render: function () {
    this.p3dBrick = new obelisk.Point3D(this.a * (size - 2), this.b * (size - 2),
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
  this.preA = a;
  this.preB = b;
  this.myBricks = [];
  this.c = colorChoice[colorIndex];
  this.cubeColor = new obelisk.CubeColor().getByHorizontalColor(this.c);
  this.cubeDms = new obelisk.CubeDimension(size, size, size);
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
    if (this.a < 10) this.a = 10;
    if (this.a > 60) this.a = 60;
    if (this.b < -20) this.b = -20;
    if (this.b > 30) this.b = 30;
  },
  render: function () {
    this.myBricks.forEach(function (item) {
      item.render();
    });
    this.p3d = new obelisk.Point3D(size * this.a, size * this.b, 0);
    this.cubeColor = new obelisk.CubeColor().getByHorizontalColor(this.c);
    pixelView.renderObject(this.cube, this.p3d);
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
        item.render();
      });

      requestAnimationFrame(draw);
    }, 200);
  }
}

setup();
draw();

socket.on('makeCube', function (data) {
  cubes.push(new cuteCube(Math.random() * 20 + 20, Math.random() * 20, data));
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