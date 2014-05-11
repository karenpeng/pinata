(function (exports) {

  exports.start = false;
  exports.explore = false;
  exports.summon = false;
  exports.times = 0;
  var score = 0;
  var colors = [
    /* green */
    '#1abc9c',

    /* yellow */
    '#f1c40f',

    /* rust */
    '#d35400',

    /* dark green */
    '#27ae60',

    /* dark blue */
    '#006CB7',

    /* light blue */
    '#3498db',

    /* violet */
    '#8e44ad',

    /* brick */
    '#e74c3c',

    /* peach */
    '#F47E43',

    /* dark violet */
    '#752763',

    /* dull green */
    '#4D947A',

    /* raspberry */
    '#DA4952',

    /* navy blue */
    '#2E4DA7'
  ];
  var myIndex;
  var oow = document.getElementById("ow");
  var ssha = document.getElementById("sha");
  var playCount = 0;

  $("#start").click(function () {
    oow.play();
    exports.start = true;
    exports.explore = true;
    $("#start").hide();
    //$("#wat").css('background-color', colors[myIndex]);
    $("#mode").show();
    $("#level").show();
    $("#summon").css('background-color', 'white');
    $("#explore").css('background-color', 'yellow');
    $("#level").attr('src',
      '/public/image/face1/PinataAvatar20140418-03-0.png');
    oow.pause();
  });

  socket.on('yourColor', function (data) {
    myIndex = data;
    $("#wat").css('background-color', colors[myIndex]);
  });

  $("#explore").click(function () {
    ssha.pause();
    $("#caught").html();
    $("#caught").hide();
    $("#level").show();
    exports.explore = true;
    $("#explore").css('background-color', 'yellow');
    exports.summon = false;
    $("#summon").css('background-color', 'white');
    socket.emit('explore', true);
    $(".hit").removeClass('hitOn');
    $("#wrapHit").hide();
  });

  $("#summon").click(function () {
    oow.pause();
    ssha.play();
    $("#level").hide();
    $("#wat").removeClass('flash');
    exports.explore = false;
    $("#explore").css('background-color', 'white');
    exports.summon = true;
    $("#summon").css('background-color', 'yellow');
    socket.emit('summon', true);
    $("#wrapHit").show();
  });

  socket.on('yourLevel', function (data) {
    level = data;
    //$('#level').html('Distance:' + ' ' + data);
    $("#level").attr('src', '/public/image/face1/PinataAvatar20140418-03-' +
      data + '.png');
    if (data === 0 && exports.start) {
      $("#wat").addClass('flash');
      if (playCount === 0) {
        oow.play();
        playCount = 1;
      }
    } else {
      $("#wat").removeClass('flash');
      if (playCount == 1) {
        oow.pause();
        playCount = 0;
      }
    }
  });

  socket.on('yourSummonTData', function (data) {
    exports.times = data;
    if (data === 1) {
      $("#hit7").addClass('hitOn');
    } else if (data === 2) {
      $("#hit6").addClass('hitOn');
    } else if (data === 3) {
      $("#hit5").addClass('hitOn');
    } else if (data === 4) {
      $("#hit4").addClass('hitOn');
    } else if (data === 5) {
      $("#hit3").addClass('hitOn');
    } else if (data === 6) {
      $("#hit2").addClass('hitOn');
    } else if (data === 7) {
      $("#hit1").addClass('hitOn');
    } else if (data === 8) {
      $("#hit0").addClass('hitOn');
    }
  });

  socket.on('yourScoreData', function (data) {
    ssha.pause();
    score = data;
    $(".hit").removeClass('hitOn');
    $("#wrapHit").hide();
    $("#level").hide();
    $("#caught").show();
    $("#caught").html(
      '<span class="catch-text">You Catch One Pinata!</span>');
  });

  socket.on('submitYourName', function () {
    $("#submitName").show();
  });

  $("#submitButton").click(function () {
    //save the name and the score in the database

  });

  socket.on('startOver', function () {
    exports.start = false;
    exports.explore = false;
    exports.summon = false;
    exports.times = 0;
    score = 0;
    $("#submitName").hide();
    $(".hit").removeClass('hitOn');
    $("#wrapHit").hide();
    $("#mode").hide();
    $("#level").hide();
    $("#caught").remove();
    $("#start").show();
    $("#wat").css('background-color', colors[myIndex]);
    oow.pause();
    ssha.pause();
  });

})(this);