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