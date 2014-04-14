(function (exports) {
  exports.start = false;
  exports.explore = true;
  exports.summon = false;

  $("#start").click(function () {
    exports.start = true;
    $("#start").hide();
    $("#mode").show();
  });

  $("#explore").click(function () {
    exports.explore = true;
    $("#explore").css('background-color', 'yellow');
    exports.summon = false;
    $("#summon").css('background-color', 'white');
    socket.emit('explore', true);
  });

  $("#summon").click(function () {
    console.log("i");
    exports.explore = false;
    $("#explore").css('background-color', 'white');
    exports.summon = true;
    $("#summon").css('background-color', 'yellow');
    socket.emit('summon', true);
  });

})(this);