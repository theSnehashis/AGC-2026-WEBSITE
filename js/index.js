  /* ── HEADER MOBILE NAV ── */
  (function () {
    const toggle = document.getElementById('navToggle');
    const nav    = document.getElementById('headerNav');
    const MOBILE = 860;

    if (!toggle || !nav) return; /* guard: header not yet loaded */

    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
    });

    document.querySelectorAll('.has-dropdown > a').forEach(function (link) {
      link.addEventListener('click', function (e) {
        if (window.innerWidth <= MOBILE) {
          e.preventDefault();
          this.closest('li').classList.toggle('open');
        }
      });
    });

    document.querySelectorAll('.nav-list > li:not(.has-dropdown) > a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= MOBILE) {
          nav.classList.remove('open');
          toggle.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > MOBILE) {
        nav.classList.remove('open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  })();

  /* ── SLIDER ── */
  /* ✅ FIX: wrap in null-check — these elements don't exist on this page.
     Running wrap.children.length when wrap is null throws a TypeError that
     crashes the entire script block mid-execution, which corrupts the banner
     overlay state machine and causes it to loop indefinitely on hover. */
  (function () {
    const wrap = document.getElementById('slidesWrap');
    const dots = document.getElementById('slDots');
    if (!wrap || !dots) return; /* ← this is the key fix */

    const n = wrap.children.length;
    let cur = 0, timer;

    for (let i = 0; i < n; i++) {
      const d = document.createElement('div');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.onclick = () => { go(i); reset(); };
      dots.appendChild(d);
    }

    function go(i) {
      cur = (i + n) % n;
      wrap.style.transform = `translateX(-${cur * 100}%)`;
      [...dots.children].forEach((d, j) => d.classList.toggle('active', j === cur));
    }
    function reset() { clearInterval(timer); timer = setInterval(() => go(cur + 1), 5500); }

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.onclick = () => { go(cur - 1); reset(); };
    if (nextBtn) nextBtn.onclick = () => { go(cur + 1); reset(); };

    reset();
  })();

  /* ── COUNTDOWN ── */
  const T = new Date('2026-03-13T09:00:00+05:30').getTime();
  function tick() {
    const d = T - Date.now();
    if (d <= 0) {
      ['cdD','cdH','cdM','cdS'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '00';
      });
      return;
    }
    const cdD = document.getElementById('cdD');
    const cdH = document.getElementById('cdH');
    const cdM = document.getElementById('cdM');
    const cdS = document.getElementById('cdS');
    if (cdD) cdD.textContent = String(Math.floor(d / 86400000)).padStart(2, '0');
    if (cdH) cdH.textContent = String(Math.floor(d % 86400000 / 3600000)).padStart(2, '0');
    if (cdM) cdM.textContent = String(Math.floor(d % 3600000 / 60000)).padStart(2, '0');
    if (cdS) cdS.textContent = String(Math.floor(d % 60000 / 1000)).padStart(2, '0');
  }
  tick();
  setInterval(tick, 1000);

  /* ── PROGRAM CHAIRS FLIP LOGIC ── */
  document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.chair-card');

    cards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        const isFlipped = this.classList.contains('flipped');
        cards.forEach(function (c) { c.classList.remove('flipped'); });
        if (!isFlipped) this.classList.add('flipped');
        e.stopPropagation();
      });
    });

    document.addEventListener('click', function () {
      cards.forEach(function (c) { c.classList.remove('flipped'); });
    });
  });