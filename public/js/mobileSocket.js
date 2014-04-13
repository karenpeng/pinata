(function (exports) {
  exports.start = false;
  exports.explore = true;
  exports.summon = false;

  $("#start").click(function () {
    exports.start = true;
    $("#start").hide();
    $("#wat").append(mode);
  });

  $("#explore").click(function () {
    exports.explore = true;
    exports.summon = false;
  });

  $("#summon").click(function () {
    exports.explore = false;
    $("#summon").css('background-color', 'yellow');
    exports.summon = true;
  });

})(this);