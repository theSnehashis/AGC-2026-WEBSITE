 /* ── HEADER MOBILE NAV ── */
  (function () {
    const toggle = document.getElementById('navToggle');
    const nav    = document.getElementById('headerNav');
    const MOBILE = 860;

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
  const wrap = document.getElementById('slidesWrap');
  const dots = document.getElementById('slDots');
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
  document.getElementById('prevBtn').onclick = () => { go(cur - 1); reset(); };
  document.getElementById('nextBtn').onclick = () => { go(cur + 1); reset(); };
  reset();

  /* ── COUNTDOWN ── */
  const T = new Date('2026-03-13T09:00:00+05:30').getTime();
  function tick() {
    const d = T - Date.now();
    if (d <= 0) {
      ['cdD','cdH','cdM','cdS'].forEach(id => document.getElementById(id).textContent = '00');
      return;
    }
    document.getElementById('cdD').textContent = String(Math.floor(d / 86400000)).padStart(2, '0');
    document.getElementById('cdH').textContent = String(Math.floor(d % 86400000 / 3600000)).padStart(2, '0');
    document.getElementById('cdM').textContent = String(Math.floor(d % 3600000 / 60000)).padStart(2, '0');
    document.getElementById('cdS').textContent = String(Math.floor(d % 60000 / 1000)).padStart(2, '0');
  }
  tick(); setInterval(tick, 1000);

  /* ── PROGRAM CHAIRS FLIP LOGIC ── */
document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.chair-card');

  cards.forEach(card => {
    card.addEventListener('click', function(e) {
      // 1. Check if this specific card is already flipped
      const isFlipped = this.classList.contains('flipped');

      // 2. Remove 'flipped' from ALL cards (Resetting others)
      cards.forEach(c => c.classList.remove('flipped'));

      // 3. If the clicked card wasn't flipped, flip it now
      // If it WAS flipped, it stays removed (flips back)
      if (!isFlipped) {
        this.classList.add('flipped');
      }
      
      // Prevent event bubbling if necessary
      e.stopPropagation();
    });
  });

  // 4. Optional: Tap anywhere else on the page to flip all cards back
  document.addEventListener('click', function() {
    cards.forEach(c => c.classList.remove('flipped'));
  });
});