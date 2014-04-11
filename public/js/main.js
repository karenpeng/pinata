var socket = io.connect('http://' + location.host);

socket.on('init', function (pageNum) {
  var deviceData = {
    device: mobile
  };
  socket.emit("deviceData", deviceData);
});

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var point = new obelisk.Point(0, 0);
var pixelView = new obelisk.PixelView(canvas, point);
var cubes = [];
var bricks = [];
var cube1;

function cuteCube(a, b) {
  this.a = a;
  this.b = b;
  this.right = 0;
  this.back = 0;
  this.c = obelisk.ColorPattern.GRASS_GREEN;
  this.cubeColor = new obelisk.CubeColor().getByHorizontalColor(this.c);
  this.cubeDms = new obelisk.CubeDimension(20, 20, 20);
  this.cube = new obelisk.Cube(this.cubeDms, this.cubeColor, false);
}

cuteCube.prototype = {
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
    if (this.a > 80) this.a = 80;
    if (this.b < -20) this.b = -20;
    if (this.b > 30) this.b = 30;
  },
  render: function () {
    this.p3d = new obelisk.Point3D(20 * this.a, 20 * this.b, 0);
    this.cubeColor = new obelisk.CubeColor().getByHorizontalColor(this.c);
    pixelView.renderObject(this.cube, this.p3d);
  }
};

function cuteBrick(a, b) {
  this.a = a;
  this.b = b;
  this.c = obelisk.ColorPattern.GRAY;
  this.brickColor = new obelisk.SideColor().getByInnerColor(this.c);
  this.dimension = new obelisk.BrickDimension(20, 20);
  this.brick = new obelisk.Brick(this.dimension, this.brickColor);
}

cuteBrick.prototype = {
  render: function () {
    this.p3dBrick = new obelisk.Point3D(this.a * 18, this.b * 18, 0);
    this.brickColor = new obelisk.SideColor().getByInnerColor(this.c);
    pixelView.renderObject(this.brick, this.p3dBrick);
  }
};

function drawBg() {
  context.beginPath();
  context.rect(0, 0, 1200, 700);
  context.fillStyle = '#ddd';
  context.fill();
}

function init() {
  cubes.push(new cuteCube(27, 7));
  for (var i = 10; i <= 80; i++) {
    for (var j = -10; j <= 45; j++) {
      var myBrick = new cuteBrick(i, j);
      bricks.push(myBrick);
    }
  }
}

function draw() {
  if (!mobile) {
    setTimeout(function () {
      drawBg();
      bricks.forEach(function (item) {
        item.render();
      });
      cubes[0].move();
      cubes[0].render();

      requestAnimationFrame(draw);
      //console.log(a, b);
    }, 200);
  }
}

init();
draw();

var preLR = 0;
var preFB = 0;
socket.on('otherLR', function (data) {
  // if (data - preLR > 0) {
  //   cube1.a++;
  // } else {
  //   cube1.a--;
  // }
  // preLR = data;
  if (data > -6 && data < 6) {
    cube1.right = 0;
  } else if (data > 6) {
    cube1.right = 1;
  } else if (data < -6) {
    cube1.right = 2;
  }
});
socket.on('otherFB', function (data) {
  // if (data - preFB > 0) {
  //   cube1.b++;
  // } else {
  //   cube1.b--;
  // }
  // preFB = data;
  if (data > -6 && data < 6) {
    cube1.back = 0;
  } else if (data > 6) {
    cube1.back = 1;
  } else if (data < -6) {
    cube1.back = 2;
  }
});

socket.on('in', function (pageNum) {

});
socket.on('leave', function (pageNum) {

});