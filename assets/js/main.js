/* ═══════════════════════════════════════════════════════════
   Portfolio — Maud Mellinger
   Filtres, maçonnerie, galerie plein écran, navigation.
   Dépend de assets/js/data.js (PROJECTS, FILTERS).
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, wait);
    };
  }

  var bySlug = {};
  PROJECTS.forEach(function (p) { bySlug[p.slug] = p; });

  /* ── En-tête : fond au défilement ───────────────────────── */
  var header = $("#header");

  function onScroll() {
    header.classList.toggle("is-stuck", window.scrollY > 40);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ── Menu mobile ────────────────────────────────────────── */
  var burger = $("#burger");
  var nav = $("#nav");

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    document.body.classList.toggle("is-locked", open);
  }

  burger.addEventListener("click", function () {
    setMenu(burger.getAttribute("aria-expanded") !== "true");
  });

  $$(".nav__list a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });

  /* ── Lien de navigation actif ───────────────────────────── */
  var navLinks = $$(".nav__list a");
  var sections = navLinks
    .map(function (a) { return $(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ── Démo reel ──────────────────────────────────────────── */
  var reel = $(".reel");
  var video = $("#reel-video");
  var playBtn = $("#reel-play");

  if (reel && video && playBtn) {
    playBtn.addEventListener("click", function () {
      reel.classList.add("is-playing");
      var p = video.play();
      if (p && p.catch) { p.catch(function () { reel.classList.remove("is-playing"); }); }
    });
    video.addEventListener("play", function () { reel.classList.add("is-playing"); });
    video.addEventListener("ended", function () { reel.classList.remove("is-playing"); });
  }

  /* ── Filtres ────────────────────────────────────────────── */
  var filtersEl = $("#filters");
  var worksEl = $("#works");
  var emptyEl = $("#works-empty");
  var cards = $$(".card", worksEl);
  var activeFilter = "all";

  FILTERS.forEach(function (f) {
    var count = f.id === "all"
      ? cards.length
      : cards.filter(function (c) { return c.dataset.tags.split(" ").indexOf(f.id) > -1; }).length;
    if (!count) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filter";
    btn.dataset.filter = f.id;
    btn.textContent = f.label;
    btn.setAttribute("aria-pressed", String(f.id === "all"));
    filtersEl.appendChild(btn);
  });

  filtersEl.addEventListener("click", function (e) {
    var btn = e.target.closest(".filter");
    if (!btn || btn.dataset.filter === activeFilter) return;

    activeFilter = btn.dataset.filter;
    $$(".filter", filtersEl).forEach(function (b) {
      b.setAttribute("aria-pressed", String(b === btn));
    });

    var shown = 0;
    cards.forEach(function (card) {
      var match = activeFilter === "all" ||
                  card.dataset.tags.split(" ").indexOf(activeFilter) > -1;
      card.hidden = !match;
      if (match) shown++;
    });

    emptyEl.hidden = shown > 0;
    layout();
  });

  /* ── Maçonnerie : hauteur de ligne par carte ────────────── */
  var rowHeight = 4;

  function layout() {
    if (!worksEl) return;
    // Les lignes valent 4px : chaque carte occupe autant de lignes que sa hauteur
    // réelle. Valable aussi sur une seule colonne, où les cartes s'empilent
    // simplement les unes sous les autres.
    rowHeight = parseFloat(window.getComputedStyle(worksEl).gridAutoRows) || 4;

    cards.forEach(function (card) {
      if (card.hidden) return;
      var inner = card.firstElementChild;
      var gap = parseFloat(window.getComputedStyle(inner).marginBottom) || 0;
      var h = inner.getBoundingClientRect().height + gap;
      card.style.gridRowEnd = "span " + Math.ceil(h / rowHeight);
    });
  }

  layout();
  window.addEventListener("resize", debounce(layout, 120));
  window.addEventListener("load", layout);
  if ("ResizeObserver" in window) {
    new ResizeObserver(debounce(layout, 90)).observe(worksEl);
  }
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(layout); }
  $$("img", worksEl).forEach(function (img) {
    if (!img.complete) { img.addEventListener("load", debounce(layout, 60)); }
  });

  /* ── Apparition au défilement ───────────────────────────── */
  if ("IntersectionObserver" in window && !reduceMotion) {
    var targets = $$(".section__head, .reel, .card, .about__text, .about__skills, .contact > *");
    targets.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = (i % 3) * 70 + "ms";
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* ── Galerie plein écran ────────────────────────────────── */
  var lb        = $("#lightbox");
  var lbImg     = $("#lb-img");
  var lbTitle   = $("#lb-title");
  var lbKicker  = $("#lb-kicker");
  var lbCaption = $("#lb-caption");
  var lbTools   = $("#lb-tools");
  var lbCount   = $("#lb-count");
  var lbLive    = $("#lb-live");
  var lbPrev    = $("#lb-prev");
  var lbNext    = $("#lb-next");
  var lbClose   = $("#lb-close");

  var current = null;   // projet affiché
  var index = 0;        // image affichée
  var lastFocus = null;

  function preload(src) { var i = new Image(); i.src = "assets/img/" + src; }

  function render() {
    var img = current.images[index];

    lbImg.classList.remove("is-ready");
    lbImg.src = "assets/img/" + img.full;
    lbImg.alt = img.alt;
    if (lbImg.complete) { lbImg.classList.add("is-ready"); }

    lbTitle.textContent = current.title;
    lbKicker.textContent = current.kicker;
    lbCaption.textContent = current.desc;
    lbTools.textContent = current.tools.join(" · ");
    lbCount.textContent = (index + 1) + " / " + current.images.length;
    lbLive.textContent = current.title + ", image " + (index + 1) + " sur " + current.images.length;

    var single = current.images.length < 2;
    lbPrev.disabled = single;
    lbNext.disabled = single;

    if (!single) {
      preload(current.images[(index + 1) % current.images.length].full);
      preload(current.images[(index - 1 + current.images.length) % current.images.length].full);
    }
  }

  lbImg.addEventListener("load", function () { lbImg.classList.add("is-ready"); });

  function go(step) {
    if (!current || current.images.length < 2) return;
    index = (index + step + current.images.length) % current.images.length;
    render();
  }

  function open(slug, trigger) {
    current = bySlug[slug];
    if (!current) return;

    index = 0;
    lastFocus = trigger || document.activeElement;

    var sbw = window.innerWidth - document.documentElement.clientWidth;
    if (sbw > 0) { document.body.style.paddingRight = sbw + "px"; }
    document.body.classList.add("is-locked");

    lb.hidden = false;
    render();
    requestAnimationFrame(function () { lb.classList.add("is-open"); });
    lbClose.focus();

    document.addEventListener("keydown", onKey);
  }

  function close() {
    lb.classList.remove("is-open");
    document.removeEventListener("keydown", onKey);

    var done = function () {
      lb.hidden = true;
      lbImg.removeAttribute("src");
      document.body.classList.remove("is-locked");
      document.body.style.paddingRight = "";
      if (lastFocus && lastFocus.isConnected) { lastFocus.focus(); }
      current = null;
    };

    if (reduceMotion) { done(); } else { setTimeout(done, 320); }
  }

  function onKey(e) {
    if (e.key === "Escape")     { e.preventDefault(); close(); }
    else if (e.key === "ArrowRight") { go(1); }
    else if (e.key === "ArrowLeft")  { go(-1); }
    else if (e.key === "Tab")   { trapFocus(e); }
  }

  function trapFocus(e) {
    var focusable = $$("button:not([disabled]), [href], input, [tabindex]:not([tabindex='-1'])", lb)
      .filter(function (el) { return el.offsetParent !== null; });
    if (!focusable.length) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  worksEl.addEventListener("click", function (e) {
    var btn = e.target.closest(".card__link");
    if (!btn) return;
    open(btn.closest(".card").dataset.slug, btn);
  });

  lbPrev.addEventListener("click", function () { go(-1); });
  lbNext.addEventListener("click", function () { go(1); });
  lbClose.addEventListener("click", close);
  $(".lightbox__backdrop").addEventListener("click", close);

  /* Balayage tactile */
  var touchX = null;
  lb.addEventListener("touchstart", function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 45) { go(dx < 0 ? 1 : -1); }
  }, { passive: true });

  /* ── Année du pied de page ──────────────────────────────── */
  var year = $("#year");
  if (year) { year.textContent = new Date().getFullYear(); }
})();
