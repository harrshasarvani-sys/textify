(() => {
  "use strict";

  // ---------------- splash screen ----------------
  (function initSplash() {
    const splash = document.getElementById("splash-screen");
    const video = document.getElementById("splash-video");
    const skipBtn = document.getElementById("splash-skip");
    if (!splash || !video) return;

    const SEEN_KEY = "textify_splash_seen";
    const alreadySeen = sessionStorage.getItem(SEEN_KEY);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (alreadySeen || reduceMotion) {
      splash.remove();
      return;
    }

    document.body.classList.add("splash-active");
    sessionStorage.setItem(SEEN_KEY, "1");

    let dismissed = false;
    function dismiss() {
      if (dismissed) return;
      dismissed = true;
      splash.classList.add("fade-out");
      document.body.classList.remove("splash-active");
      setTimeout(() => splash.remove(), 650);
    }

    video.addEventListener("ended", dismiss);
    skipBtn.addEventListener("click", dismiss);
    splash.addEventListener("click", (e) => {
      if (e.target === splash) dismiss();
    });

    // If autoplay is blocked or the file fails to load, don't trap the user.
    video.addEventListener("error", dismiss);
    setTimeout(dismiss, 8000); // safety net past the ~6s clip length

    video.play().catch(dismiss);
  })();

  // All languages TextifyPro supports — Indian languages via Sarvam AI,
  // global languages via ElevenLabs.
  const LANGUAGES = [
    { code: "en-IN", native: "English", english: "English", provider: "sarvam" },
    { code: "hi-IN", native: "हिन्दी", english: "Hindi", provider: "sarvam" },
    { code: "bn-IN", native: "বাংলা", english: "Bengali", provider: "sarvam" },
    { code: "ta-IN", native: "தமிழ்", english: "Tamil", provider: "sarvam" },
    { code: "te-IN", native: "తెలుగు", english: "Telugu", provider: "sarvam" },
    { code: "kn-IN", native: "ಕನ್ನಡ", english: "Kannada", provider: "sarvam" },
    { code: "ml-IN", native: "മലയാളം", english: "Malayalam", provider: "sarvam" },
    { code: "mr-IN", native: "मराठी", english: "Marathi", provider: "sarvam" },
    { code: "gu-IN", native: "ગુજરાતી", english: "Gujarati", provider: "sarvam" },
    { code: "pa-IN", native: "ਪੰਜਾਬੀ", english: "Punjabi", provider: "sarvam" },
    { code: "od-IN", native: "ଓଡ଼ିଆ", english: "Odia", provider: "sarvam" },
    { code: "as-IN", native: "অসমীয়া", english: "Assamese", provider: "sarvam" },
    { code: "ur-IN", native: "اردو", english: "Urdu", provider: "sarvam" },
    { code: "ne-IN", native: "नेपाली", english: "Nepali", provider: "sarvam" },
    { code: "sa-IN", native: "संस्कृतम्", english: "Sanskrit", provider: "sarvam" },
    { code: "sd-IN", native: "سنڌي", english: "Sindhi", provider: "sarvam" },
    { code: "kok-IN", native: "कोंकणी", english: "Konkani", provider: "sarvam" },
    { code: "ks-IN", native: "کٲشُر", english: "Kashmiri", provider: "sarvam" },
    { code: "sat-IN", native: "ᱥᱟᱱᱛᱟᱲᱤ", english: "Santali", provider: "sarvam" },
    { code: "mni-IN", native: "ꯃꯤꯇꯩꯂꯣꯟ", english: "Manipuri", provider: "sarvam" },
    { code: "brx-IN", native: "बड़ो", english: "Bodo", provider: "sarvam" },
    { code: "mai-IN", native: "मैथिली", english: "Maithili", provider: "sarvam" },
    { code: "doi-IN", native: "डोगरी", english: "Dogri", provider: "sarvam" },
    { code: "ko", native: "한국어", english: "Korean", provider: "elevenlabs" },
    { code: "ar", native: "العربية", english: "Arabic", provider: "elevenlabs" },
    { code: "es", native: "Español", english: "Spanish", provider: "elevenlabs" },
    { code: "fr", native: "Français", english: "French", provider: "elevenlabs" },
    { code: "zh", native: "中文", english: "Chinese", provider: "elevenlabs" },
    { code: "de", native: "Deutsch", english: "German", provider: "elevenlabs" },
  ];

  // ---------------- language grid ----------------
  const grid = document.getElementById("lang-grid");
  LANGUAGES.forEach(({ native, english, provider }) => {
    const chip = document.createElement("div");
    chip.className = "lang-chip";
    const providerLabel = provider === "elevenlabs" ? "ElevenLabs" : "Sarvam AI";
    chip.innerHTML = `<span class="lang-native">${native}</span><span class="lang-english">${english}</span><span class="lang-provider">${providerLabel}</span>`;
    grid.appendChild(chip);
  });

  // ---------------- ticker ----------------
  const track = document.getElementById("ticker-track");
  const buildSet = () => {
    const set = document.createElement("span");
    set.textContent = LANGUAGES.map((l) => l.native).join("  ·  ");
    return set;
  };
  // duplicate content so the marquee loops seamlessly
  track.appendChild(buildSet());
  track.appendChild(buildSet());

  // ---------------- ambient particle background ----------------
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  const PALETTE = ["124,92,252", "41,231,205", "236,234,245"];
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  class Dust {
    constructor() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.3 + 0.4;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = Math.random() * 0.12 + 0.02;
      this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      this.alpha = Math.random() * 0.3 + 0.06;
      this.drift = Math.random() * 0.015 - 0.0075;
    }
    update() {
      this.angle += this.drift;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed - 0.03;
      if (this.y < -10) this.y = H + 10;
      if (this.x < -10) this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
    }
    draw() {
      ctx.beginPath();
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const count = Math.min(Math.round((W * H) / 16000), 160);
  const dust = Array.from({ length: count }, () => new Dust());

  function frame() {
    ctx.clearRect(0, 0, W, H);
    dust.forEach((d) => {
      d.update();
      d.draw();
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

// ---------------------------------------------------------------------
// "Your voice, delivered perfectly" CTA card — dithered warp background.
// Vanilla-canvas approximation of a 4x4 ordered-dither shader: a low-res
// grid is animated with layered sine waves, thresholded against a Bayer
// matrix, then upscaled without smoothing for the blocky dither look.
// Speeds up on hover, matching the reference component's behaviour.
// ---------------------------------------------------------------------
(() => {
  const canvas = document.getElementById("dither-canvas");
  const card = document.getElementById("dither-card");
  if (!canvas || !card) return;

  const ctx = canvas.getContext("2d", { alpha: true });

  const COLS = 96;
  const ROWS = 54;
  const off = document.createElement("canvas");
  off.width = COLS;
  off.height = ROWS;
  const octx = off.getContext("2d");
  const imgData = octx.createImageData(COLS, ROWS);

  // 4x4 Bayer dithering matrix, normalized to 0..1
  const BAYER = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ].map((row) => row.map((v) => (v + 0.5) / 16));

  // Brand gradient endpoints (violet -> cyan)
  const COLOR_A = [124, 92, 252];
  const COLOR_B = [41, 231, 205];

  let speed = 0.2;
  let t = 0;
  let raf = null;
  let running = true;

  function resizeCanvas() {
    const rect = card.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width));
    canvas.height = Math.max(1, Math.round(rect.height));
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function draw() {
    t += speed * 0.015;

    for (let y = 0; y < ROWS; y++) {
      const ny = y / ROWS;
      for (let x = 0; x < COLS; x++) {
        const nx = x / COLS;

        // Layered sine/cosine "warp" field, animated over time.
        const warp =
          Math.sin((nx * 5.5 + t) * 2.0) +
          Math.cos((ny * 5.0 - t * 1.2) * 1.8) +
          Math.sin((nx * 3.0 + ny * 3.5 + t * 0.8) * 2.4);
        const v = (warp + 3) / 6; // normalize roughly to 0..1

        const threshold = BAYER[y % 4][x % 4];
        const on = v > threshold;

        const idx = (y * COLS + x) * 4;
        if (on) {
          const mix = nx; // gradient left(violet) -> right(cyan)
          imgData.data[idx] = COLOR_A[0] + (COLOR_B[0] - COLOR_A[0]) * mix;
          imgData.data[idx + 1] = COLOR_A[1] + (COLOR_B[1] - COLOR_A[1]) * mix;
          imgData.data[idx + 2] = COLOR_A[2] + (COLOR_B[2] - COLOR_A[2]) * mix;
          imgData.data[idx + 3] = Math.round(210 * Math.min(1, v));
        } else {
          imgData.data[idx + 3] = 0;
        }
      }
    }

    octx.putImageData(imgData, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(off, 0, 0, canvas.width, canvas.height);

    if (running) raf = requestAnimationFrame(draw);
  }

  card.addEventListener("mouseenter", () => {
    speed = 0.6;
  });
  card.addEventListener("mouseleave", () => {
    speed = 0.2;
  });

  // Pause the animation off-screen to save battery/CPU.
  const observer = new IntersectionObserver(
    ([entry]) => {
      running = entry.isIntersecting;
      if (running && !raf) raf = requestAnimationFrame(draw);
    },
    { threshold: 0.05 }
  );
  observer.observe(card);

  raf = requestAnimationFrame(draw);
})();
