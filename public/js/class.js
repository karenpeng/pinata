(function (exports) {

  var cubeSize = 16;
  var trackSize = cubeSize - 2;

  function cuteBrick(a, b) {
    this.a = a;
    this.b = b;
    this.brickColor = new obelisk.SideColor(0x000000, 0x33a0844c);
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

  function pinata(a, b, id) {
    this.a = a;
    this.b = b;
    this.id = id;
    this.z = 0;
    this.cubeDms = new obelisk.CubeDimension(cubeSize, cubeSize, cubeSize);
    this.cubeColor = new obelisk.CubeColor().getByHorizontalColor(obelisk.ColorPattern
      .PINK);
    this.cube = new obelisk.Cube(this.cubeDms, this.cubeColor, false);
    this.p3d = new obelisk.Point3D(trackSize * this.a, trackSize * this.b,
      trackSize * this.z);

  }
  pinata.prototype = {
    render: function () {
      pixelView.renderObject(this.cube, this.p3d);
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
    this.pinataId;
    this.score = 0;
    this.scoreCounter = 0;
    this.preScore = 0;
    this.myBricks = [];
    this.c = c;
    this.originalC = this.c;
    //this.cubeDms = new obelisk.CubeDimension(cubeSize, cubeSize, cubeSize);
    this.cubeColor = new obelisk.CubeColor().getByHorizontalColor(this.c);
    //this.cube = new obelisk.Cube(this.cubeDms, this.cubeColor, false);
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
        this.scoreCounter = 0;
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
          if (this.summonTimes < 9) {
            this.z++;
          }
          this.summonTimes++;
          if (this.summonTimes < 9) {
            var summonTData = {
              id: this.id,
              times: this.summonTimes
            };
            socket.emit('summonTData', summonTData);
          }
          if (this.z > 1) {
            this.z = 0;
          }
        } else {
          this.z = 0;
        }
      }
      if (this.a < 24) this.a = 24;
      if (this.a > 70) this.a = 70;
      if (this.b < -20) this.b = -20;
      if (this.b > 30) this.b = 30;

    },
    check: function (arr) {
      var that = this;
      var minDis = 10000000000;
      arr.forEach(function (item) {
        var gapX = that.a * trackSize - item.a * trackSize;
        var gapY = that.b * trackSize - item.b * trackSize;
        var dis = Math.sqrt(Math.pow(gapX, 2) + Math.pow(gapY, 2));
        if (minDis > dis) {
          minDis = dis;
          that.pinataId = item.id;
        }
      });

      if (minDis < 100) this.level = 0;
      else if (minDis < 200) this.level = 1;
      else if (minDis < 300) this.level = 2;
      else if (minDis < 400) this.level = 3;
      else if (minDis < 500) this.level = 4;
      else this.level = 5;
      if (this.explore && this.preLevel !== this.level) {
        var levelData = {
          id: this.id,
          level: this.level
        };
        socket.emit('levelData', levelData);
        this.preLevel = this.level;
      }
    },
    win: function () {
      if (this.scoreCounter === 0 && this.summonTimes === 8 && this.level ===
        0) {
        this.score++;
        this.scoreCounter = 1;
        //this.summonTimes = 0;
        if (this.preScore !== this.score) {
          var scoreData = {
            id: this.id,
            score: this.score
          };
          socket.emit('scoreData', scoreData);
          this.preScore = this.score;
        }
        console.log(this.score);
        return true;
      }
    },
    render: function () {
      this.p3d = new obelisk.Point3D(trackSize * this.a, trackSize * this.b,
        trackSize * this.z);
      this.cubeDms = new obelisk.CubeDimension(cubeSize, cubeSize, cubeSize *
        (this.score + 1));
      this.cube = new obelisk.Cube(this.cubeDms, this.cubeColor, false);
      pixelView.renderObject(this.cube, this.p3d);
    },
    renderTrack: function () {
      this.myBricks.forEach(function (item) {
        item.render();
      });
    }
  };
  exports.pinata = pinata;
  exports.cuteCube = cuteCube;
  exports.cuteBrick =
    cuteBrick;
})(this);