(function (exports) {
  exports.shake = false;
  var preX, preY, preZ = 0;
  var count = 0;
  init();

  function init() {
    if ((window.DeviceMotionEvent) || ('listenForDeviceMovement' in window)) {
      window.addEventListener('devicemotion', deviceMotionHandler, false);
    } else {
      document.getElementById("dmEvent").innerHTML =
        "Motion detection not supported, sorry.";
    }
  }

  function deviceMotionHandler(eventData) {
    var info, xyz = "[X, Y, Z]";
    var acceleration = eventData.acceleration;
    info = xyz.replace("X", round(acceleration.x));
    info = info.replace("Y", round(acceleration.y));
    info = info.replace("Z", round(acceleration.z));
    ifShake(acceleration.x, acceleration.y, acceleration.z);
  }

  function round(val) {
    var amt = 10;
    return Math.round(val * amt) / amt;
  }

  function ifShake(x, y, z) {
    if (Math.abs(preX - x) > 12) {
      exports.shake = true;
      preX = x;
    } else if (Math.abs(preY - y) > 12) {
      exports.shake = true;
      preY = y;
    } else if (Math.abs(preZ - z) > 12) {
      exports.shake = true;
      preZ = z;
    } else {
      exports.shake = false;
    }
    count++;
    if (summon && count % 4 === 0) {
      socket.emit('shakeData', exports.shake);
    }
  }

})(this);