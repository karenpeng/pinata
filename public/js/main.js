var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
// create pixel view container in point
var point = new obelisk.Point(0, 0);
var pixelView = new obelisk.PixelView(canvas, point);
var dms = 20;
var a = 23;
var b = -17;

var p3d, cubeDms, cubeColor, cube;
var color, dimension, brick, p3dBrick;

// create brick
// function cuteCube() {
// 		this.
// }

// cuteCube.prototype = {

// }
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

function draw() {
		drawBg();

		color = new obelisk.SideColor().getByInnerColor(obelisk.ColorPattern.GREEN);
		dimension = new obelisk.BrickDimension(20, 20);
		brick = new obelisk.Brick(dimension, color);
		p3dBrick = new obelisk.Point3D(20 * a, 20 * b, 0);
		pixelView.renderObject(brick, p3dBrick);

		p3d = new obelisk.Point3D(20 * a, 20 * b, 0);
		cubeDms = new obelisk.CubeDimension(20, 20, 20);
		cubeColor = new obelisk.CubeColor().getByHorizontalColor(obelisk.ColorPattern
				.GRASS_GREEN);
		cube = new obelisk.Cube(cubeDms, cubeColor, false);
		pixelView.renderObject(cube, p3d);

		requestAnimationFrame(draw);
		console.log(a, b);
}
draw();

$(window).keydown(function (event) {
		if (event.which === 37) {
				event.preventDefault();
				a++;
		} else if (event.which === 39) {
				event.preventDefault();
				a--;
		} else if (event.which === 38) {
				event.preventDefault();
				b--;
		} else if (event.which === 40) {
				event.preventDefault();
				b++;
		}
});