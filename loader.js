(() => {
  "use strict";

  // Builds (or reuses) the full-screen lava-lamp loader overlay and wires
  // it up to (a) links marked data-loader-nav, so it plays for a beat
  // before the browser swaps documents, and (b) pages whose <body> has
  // data-loader-on-enter, so it plays briefly on arrival.

  function ensureLoader() {
    let el = document.getElementById("route-loader");
    if (el) return el;
    el = document.createElement("div");
    el.id = "route-loader";
    el.className = "route-loader";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML =
      '<div class="lava-lamp">' +
      '<span class="bubble"></span>' +
      '<span class="bubble b1"></span>' +
      '<span class="bubble b2"></span>' +
      '<span class="bubble b3"></span>' +
      "</div>";
    document.body.appendChild(el);
    return el;
  }

  const loader = ensureLoader();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function show() {
    loader.classList.add("active");
  }
  function hide() {
    loader.classList.remove("active");
  }

  window.TextifyLoader = { show, hide };

  // Play on arrival, then fade once the page has settled.
  if (document.body.hasAttribute("data-loader-on-enter")) {
    show();
    window.addEventListener("load", () => {
      setTimeout(hide, reduceMotion ? 0 : 620);
    });
  }

  // Intercept clicks on same-tab links into the recorder/chat so the
  // loader has time to play before navigation happens.
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-loader-nav]");
    if (!link) return;
    if (link.target === "_blank" || event.metaKey || event.ctrlKey || event.shiftKey) return;

    const href = link.getAttribute("href");
    if (!href) return;

    event.preventDefault();
    show();
    setTimeout(() => {
      window.location.href = href;
    }, reduceMotion ? 0 : 480);
  });
})();
