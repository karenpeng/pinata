(function (exports) {

  var preLR = 0;
  var preFB = 0;
  var lr = 0;
  var fb = 0;

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

    if (start && explore) {
      if (tiltLR > -6 && tiltLR < 6) {
        lr = 0;
      } else if (tiltLR > 6) {
        lr = 1;
      } else {
        lr = 2;
      }
      if (preLR !== lr) {
        socket.emit('lrData', lr);
        preLR = lr;
      }
      if (tiltFB > -6 && tiltFB < 6) {
        fb = 0;
      } else if (tiltFB > 6) {
        fb = 1;
      } else {
        fb = 2;
      }
      if (preFB !== fb) {
        socket.emit('fbData', fb);
        preFB = fb;
      }
    }
  }

})(this);