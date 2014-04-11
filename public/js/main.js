var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
// create pixel view container in point
var point = new obelisk.Point(0, 0);
var pixelView = new obelisk.PixelView(canvas, point);
var dms = 20;

var p3d, cubeDms, cubeColor, cube;

// create brick
function cuteCube(a, b) {
  this.a = a;
  this.b = b;
  this.p3d = new obelisk.Point3D(20 * this.a, 20 * this.b, 0);
  this.cubeDms = new obelisk.CubeDimension(20, 20, 20);
  this.cubeColor = new obelisk.CubeColor().getByHorizontalColor(obelisk.ColorPattern
    .GRASS_GREEN);
  this.cube = new obelisk.Cube(this.cubeDms, this.cubeColor, false);

}

cuteCube.prototype = {
  render: function () {
    pixelView.renderObject(this.cube, this.p3d);
  }
};

function drawBg() {
  context.beginPath();
  context.rect(0, 0, 1200, 700);
  context.fillStyle = '#ddd';
  context.fill();
}

// var color = new obelisk.SideColor().getByInnerColor(obelisk.ColorPattern.GRAY);
// var dimension = new obelisk.BrickDimension(dms, dms);
// var brick = new obelisk.Brick(dimension, color);
// var p3dBrick = new obelisk.Point3D(i * (dms - 2), j * (dms - 2), 0);
// pixelView.renderObject(brick, p3dBrick);

var cube1 = new cuteCube(23, -17);

function draw() {
  if (!mobile) {
    drawBg();

    var color = new obelisk.SideColor().getByInnerColor(obelisk.ColorPattern.GRAY);
    var dimension = new obelisk.BrickDimension(dms, dms);
    var brick = new obelisk.Brick(dimension, color);
    for (var i = 10; i <= 80; i++) {
      for (var j = -10; j <= 45; j++) {
        var p3dBrick = new obelisk.Point3D(i * (dms - 2), j * (dms - 2), 0);
        pixelView.renderObject(brick, p3dBrick);
      }
    }

    // p3d = new obelisk.Point3D(20 * a, 20 * b, 0);
    // cubeDms = new obelisk.CubeDimension(20, 20, 20);
    // cubeColor = new obelisk.CubeColor().getByHorizontalColor(obelisk.ColorPattern
    //   .GRASS_GREEN);
    // cube = new obelisk.Cube(cubeDms, cubeColor, false);
    // pixelView.renderObject(cube, p3d);
    cube1.render();

    requestAnimationFrame(draw);
    //console.log(a, b);
  }
}
draw();

var preLR = 0;
var preFB = 0;
socket.on('otherLR', function (data) {
  setInterval(
    function () {
      cube1.a += data;
    }, 100
  );
});
socket.on('otherFB', function (data) {
  if (data > 0) {
    cube1.b++;
  } else {
    cube1.b--;
  }
});

$(window).keydown(function (event) {
  if (event.which === 37) {
    event.preventDefault();
    a--;
  } else if (event.which === 39) {
    event.preventDefault();
    a++;
  } else if (event.which === 38) {
    event.preventDefault();
    b--;
  } else if (event.which === 40) {
    event.preventDefault();
    b++;
  }
});