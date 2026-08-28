// copierland 누적 판매 카운터 — <span data-counter="slug">0</span> 옆에 삽입
(function () {
  var COUNTERS_URL = new URL("counters.json", document.currentScript.src).href;
  var DURATION = 2000;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function fmt(n) { return Math.round(n).toLocaleString("ko-KR"); }

  function animate(el, target) {
    if (reduced) { el.textContent = fmt(target); return; }
    var start = performance.now();
    function step(now) {
      var t = Math.min((now - start) / DURATION, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = fmt(target * eased);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  fetch(COUNTERS_URL).then(function (r) { return r.json(); }).then(function (data) {
    var els = document.querySelectorAll("[data-counter]");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var item = data[el.getAttribute("data-counter")];
        if (item) animate(el, item.qty);
        io.unobserve(el);
      });
    });
    els.forEach(function (el) { io.observe(el); });
  });
})();
