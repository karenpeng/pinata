(function (exports) {
  exports.start = false;
  exports.explore = true;
  exports.summon = false;

  $("#start").click(function () {
    exports.start = true;
    $("#start").hide();
    $("#mode").show();
    // $("#wat").append(mode);

  });

  $("#explore").click(function () {
    console.log("j");
    exports.explore = true;
    exports.summon = false;
    socket.emit('explore', true);
  });

  $("#summon").click(function () {
    console.log("i");
    exports.explore = false;
    $("#summon").css('background-color', 'yellow');
    exports.summon = true;
    socket.emit('summon', true);
  });

  var scale = 1;
  var cubeSize = 24 * scale;
  var trackSize = 12 * scale;

  var pinataX, pinataY;
  socket.on('pinata', function (data) {
    pinataX = data.x * trackSize;
    pinataY = data.y * trackSize;
  });

  var myX, myY, myId;
  socket.on('urLocation', function (data) {
    myX = data.x;
    myY = data.y;
    myId = data.id;
  });

  var right = 0;
  var back = 0;
  var myLocX = myX * trackSize;
  var myLocY = myY * trackSize;
  var dis;
  var word;

  function check() {
    if (sending) {
      if (lr >= -6 && lr < 6) {
        right = 0;
      } else if (lr > 6) {
        right = 1;
      } else {
        right = 2;
      }
      if (fb >= -6 && fb < 6) {
        back = 0;
      } else if (fb > 6) {
        back = 1;
      } else {
        back = 2;
      }
    }
  }

  function walk() {
    if (right === 1) {
      myX++;
    } else if (right === 2) {
      myX--;
    }
    if (myX < 20) myX = 20;
    if (myX > 60) myX = 60;

    if (back === 1) {
      myY++;
    } else if (back === 2) {
      myY--;
    }
    if (myY < -10) myY = -10;
    if (myY > 30) myY = 30;
    myLocX = myX * trackSize;
    myLocY = myY * trackSize;
  }

  function count() {
    setTimeout(function () {
      if (start) {
        if (exports.explore) {
          check();
          walk();
        }
      }

      dis = Math.sqrt(Math.pow((myLocX - pinataX), 2) + Math.pow((myLocY -
        pinataY), 2));

      if (dis < 30) {
        word = 'close!';
      } else {
        word = 'keep searching';
      }

      //document.getElementById("doTiltLR").innerHTML = myLocX;
      //document.getElementById("doTiltFB").innerHTML = myLocY;
      document.getElementById("dis").innerHTML = dis;
      document.getElementById("explore").innerHTML = exports.explore;
      document.getElementById("summon").innerHTML = exports.summon;
      document.getElementById("ddd").innerHTML = shake;
      //document.getElementById("alert").innerHTML = word;
      requestAnimationFrame(count);
    }, 120);
  }

  count();

})(this);