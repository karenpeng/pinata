var x, y;

var initXY = {
  x: Math.random() * 20 + 20,
  y: Math.random() * 20
};
socket.emit('initXY', initXY);

socket.on('pinataOh', function (data) {
  x = data.x;
  y = data.y;
});

function count() {
  setTimeout(function () {
    document.getElementById("pinataX").innerHTML = x;
    document.getElementById("pinataY").innerHTML = y;
    requestAnimationFrame(count);
  }, 120);
}

count();