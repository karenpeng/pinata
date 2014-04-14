(function (exports) {
  exports.start = false;
  exports.explore = false;
  exports.summon = false;

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
  });

  $("#summon").click(function () {
    $("#wat").removeClass('flash');
    exports.explore = false;
    $("#explore").css('background-color', 'white');
    exports.summon = true;
    $("#summon").css('background-color', 'yellow');
    socket.emit('summon', true);
  });

  socket.on('yourLevel', function (data) {
    $('#level').html('Distance:' + ' ' + data);
    if (data === 0) {
      $("#wat").addClass('flash');
    } else {
      $("#wat").removeClass('flash');
    }
  });

})(this);