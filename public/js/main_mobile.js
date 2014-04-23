(function (exports) {
  exports.start = false;
  exports.explore = false;
  exports.summon = false;
  exports.times = 0;
  var score = 0;
  var colors = [
    '#1abc9c',
    '#27ae60',
    '#3498db',
    '#8e44ad',
    '#f1c40f',
    '#d35400',
    '#e74c3c',
    '#006CB7',
    '#076BB6',
    '#F47E43',
    '#752763',
    '#4D947A',
    '#DA4952',
    '#F47D45',
    '#2E4DA7',
    '#8DAED7'
  ];
  var myIndex;

  $("#start").click(function () {
    exports.start = true;
    exports.explore = true;
    $("#start").hide();
    $("#wat").css('background-color', colors[myIndex]);
    $("#mode").show();
    $("#level").show();
    $("#summon").css('background-color', 'white');
    $("#explore").css('background-color', 'yellow');
    $("#level").attr('src',
      '/public/image/face1/PinataAvatar20140418-03-0.png');
  });

  socket.on('yourColor', function (data) {
    myIndex = data;
  });

  $("#explore").click(function () {
    $("#caught").remove();
    $("#level").show();
    exports.explore = true;
    $("#explore").css('background-color', 'yellow');
    exports.summon = false;
    $("#summon").css('background-color', 'white');
    socket.emit('explore', true);
    $(".hit").removeClass('hitOn');
    $(".hit").hide();
  });

  $("#summon").click(function () {
    $("#level").hide();
    $("#wat").removeClass('flash');
    exports.explore = false;
    $("#explore").css('background-color', 'white');
    exports.summon = true;
    $("#summon").css('background-color', 'yellow');
    socket.emit('summon', true);
    $(".hit").show();
  });

  socket.on('yourLevel', function (data) {
    //$('#level').html('Distance:' + ' ' + data);
    $("#level").attr('src', '/public/image/face1/PinataAvatar20140418-03-' +
      data + '.png');
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

  socket.on('yourScoreData', function (data) {
    score = data;
    $(".hit").removeClass('hitOn');
    $(".hit").hide();
    $("#level").hide();
    $("#wat").append('<div id="caught">You Catch One Pinata!</div>');
  });

  socket.on('startOver', function () {
    exports.start = false;
    exports.explore = false;
    exports.summon = false;
    exports.times = 0;
    score = 0;
    $(".hit").removeClass('hitOn');
    $(".hit").hide();
    $("#mode").hide();
    $("#level").hide();
    $("#caught").remove();
    $("#start").show();
    $("#wat").css('background-color', 'white');
  });

})(this);