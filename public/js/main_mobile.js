(function (exports) {
  exports.start = false;
  exports.explore = false;
  exports.summon = false;
  exports.times = 0;
  var score = 0;

  $("#start").click(function () {
    exports.start = true;
    exports.explore = true;
    $("#start").hide();
    $("#mode").show();
    $("#level").show();
  });

  $("#explore").click(function () {
    exports.explore = true;
    $("#explore").css('background-color', 'yellow');
    exports.summon = false;
    $("#summon").css('background-color', 'white');
    socket.emit('explore', true);
    $(".hit").removeClass('hitOn');
    $(".hit").hide();
  });

  $("#summon").click(function () {
    $("#wat").removeClass('flash');
    exports.explore = false;
    $("#explore").css('background-color', 'white');
    exports.summon = true;
    $("#summon").css('background-color', 'yellow');
    socket.emit('summon', true);
    $(".hit").show();
  });

  socket.on('yourLevel', function (data) {
    $('#level').html('Distance:' + ' ' + data);
    if (data === 0 && exports.start) {
      $("#wat").addClass('flash');
    } else {
      $("#wat").removeClass('flash');
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

  socket.on('yourScoreData', function () {
    score = data;
    $(".hit").removeClass('hitOn');
    $(".hit").hide();
    $("#wat").append('<div id="caught">You Catch' + score + 'Pinata!</div>');
  });

  socket.on('startOver', function () {
    exports.start = false;
    exports.explore = false;
    exports.summon = false;
    exports.times = 0;
    score = 0;
    $("#start").show();
    $("#mode").hide();
    $("#level").hide();
  });

})(this);