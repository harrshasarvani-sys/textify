// Vanilla-canvas take on an animated "dotted surface": a grid of dots
// behind the wordmark, brightening and swelling in a slow travelling
// wave. Stands in for a Three.js particle plane without needing a
// bundler or WebGL — this project ships as plain HTML/CSS/JS.
(() => {
  "use strict";

  const canvas = document.getElementById("dotted-surface");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const SPACING = 26;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0;
  let t = 0;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    const host = canvas.parentElement;
    const rect = host.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    const cols = Math.ceil(W / SPACING) + 1;
    const rows = Math.ceil(H / SPACING) + 1;

    for (let iy = 0; iy < rows; iy++) {
      for (let ix = 0; ix < cols; ix++) {
        const x = ix * SPACING;
        const baseY = iy * SPACING;

        const wave =
          Math.sin(ix * 0.35 + t) * 0.5 + Math.sin(iy * 0.3 - t * 0.8) * 0.5;
        const lift = Math.max(0, wave);

        const alpha = 0.05 + lift * 0.18;
        const radius = 1 + lift * 1.5;
        const y = baseY + Math.sin(ix * 0.35 + t) * 4;

        ctx.beginPath();
        ctx.fillStyle = `rgba(124, 92, 252, ${alpha})`;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (!reduceMotion) {
      t += 0.018;
      requestAnimationFrame(drawFrame);
    }
  }

  drawFrame();
})();
