window.addEventListener('DOMContentLoaded', (e) => {
  function getCanvasCoord(event) {
    var mx = event.clientX;
    var my = event.clientY;
    var canvas = document.querySelector('canvas');
    var rect = canvas.getBoundingClientRect(); // check if your browser supports this
    mx = mx - rect.left;
    my = my - rect.top;
    const result = { x: mx, y: my };
    return;
  }
  document.addEventListener('click', getCanvasCoord);
});

// window.addEventListener("resize", () => {
//   var canvas = document.querySelector("canvas");
//   console.log(canvas.width);
//   console.log(canvas.height);
// });
