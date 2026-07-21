/**
 * Subtle Matrix-style binary rain for page background.
 * Skips when the user prefers reduced motion.
 */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var canvas = document.createElement("canvas");
  canvas.id = "matrix-bg";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  var ctx = canvas.getContext("2d");
  var fontSize = 14;
  var columns = [];
  var chars = "01";
  var rafId = 0;
  var lastStep = 0;
  var stepMs = 90;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var colCount = Math.ceil(canvas.width / fontSize);
    columns = new Array(colCount);
    for (var i = 0; i < colCount; i++) {
      columns[i] = Math.random() * (canvas.height / fontSize);
    }
  }

  function draw(now) {
    rafId = window.requestAnimationFrame(draw);
    if (now - lastStep < stepMs) return;
    lastStep = now;

    ctx.fillStyle = "rgba(238, 242, 246, 0.06)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + "px 'JetBrains Mono', ui-monospace, monospace";
    ctx.fillStyle = "rgba(13, 148, 136, 0.85)";

    for (var i = 0; i < columns.length; i++) {
      var text = chars.charAt(Math.floor(Math.random() * chars.length));
      var x = i * fontSize;
      var y = columns[i] * fontSize;

      ctx.fillText(text, x, y);

      if (y > canvas.height && Math.random() > 0.975) {
        columns[i] = 0;
      } else {
        columns[i]++;
      }
    }
  }

  resize();
  rafId = window.requestAnimationFrame(draw);

  var resizeTimer;
  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 150);
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      window.cancelAnimationFrame(rafId);
    } else {
      rafId = window.requestAnimationFrame(draw);
    }
  });
})();
