(function (exports) {

  var count = 0;
  var preLR = 0;
  var preFB = 0;

  init();

  function init() {
    if (mobile) {
      if (window.DeviceOrientationEvent) {
        //document.getElementById("doEvent").innerHTML = "DeviceOrientation";
        // Listen for the deviceorientation event and handle the raw data
        window.addEventListener('deviceorientation', function (eventData) {
          // gamma is the left-to-right tilt in degrees, where right is positive
          var tiltLR = eventData.gamma;

          // beta is the front-to-back tilt in degrees, where front is positive
          var tiltFB = eventData.beta;

          // call our orientation event handler
          deviceOrientationHandler(tiltLR, tiltFB);
        }, false);
      } else {
        document.getElementById("doEvent").innerHTML =
          "Not supported on your device or browser, sorry.";
      }
    }
  }

  function deviceOrientationHandler(tiltLR, tiltFB) {
    document.getElementById("doTiltLR").innerHTML = Math.round(tiltLR);
    document.getElementById("doTiltFB").innerHTML = Math.round(tiltFB);

    // if (Math.abs(preLR - tiltLR) > 6) {
    //   socket.emit("lrData", Math.round(tiltLR));
    //   preLR = tiltLR;
    // }
    // if (Math.abs(preFB - tiltFB) > 6) {
    //   socket.emit("fbData", Math.round(tiltFB));
    //   preFB = tiltFB;
    // }
    var lr = Math.round(tiltLR);
    var fb = Math.round(tiltFB);
    //if (lr < -2 || lr > 2) {
    socket.emit('lrData', lr);
    //}
    //if (fb < -2 || fb > 2) {
    socket.emit('fbData', fb);
    //}
  }

})(this);