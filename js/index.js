/* ── HEADER MOBILE NAV ── */
    (function () {
      const toggle = document.getElementById('navToggle');
      const nav    = document.getElementById('headerNav');
      const MOBILE = 860;
      if (!toggle || !nav) return;
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
    (function () {
      const wrap = document.getElementById('slidesWrap');
      const dots = document.getElementById('slDots');
      if (!wrap || !dots) return;
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
    const units = document.querySelector('.cnt-units');
    if (units) units.innerHTML = '<span style="font-family:\'Oswald\',sans-serif;font-size:28px;font-weight:700;letter-spacing:3px;color:#fff;">EXPIRED</span>';
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

    /* ── FLIP CARDS — exclusive toggle ─────────────────────────────────────
       One shared activeCard across all card types (.chair-card, .flip-card,
       .speaker-flip-card). Opening any card closes the previously open one.
       No CSS :hover flip rule exists — JS drives everything so touch and
       mouse behave identically.
    ── */
    document.addEventListener('DOMContentLoaded', function () {

      let activeCard = null;

      function bindExclusiveFlip(cards, flipClass) {
        cards.forEach(function (card) {
          if (card.dataset.flipBound) return;
          card.dataset.flipBound = 'true';

          card.addEventListener('click', function (e) {
            e.stopPropagation();

            if (card === activeCard) {
              /* same card tapped — close it */
              card.classList.remove(flipClass);
              card.setAttribute('aria-pressed', 'false');
              activeCard = null;
            } else {
              /* close whatever is open */
              if (activeCard) {
                activeCard.classList.remove('flipped', 'is-flipped');
                activeCard.setAttribute('aria-pressed', 'false');
              }
              card.classList.add(flipClass);
              card.setAttribute('aria-pressed', 'true');
              activeCard = card;
            }
          });

          /* Keyboard: Enter / Space */
          card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              card.click();
            }
          });
        });
      }

      bindExclusiveFlip(document.querySelectorAll('.chair-card'),        'flipped');
      bindExclusiveFlip(document.querySelectorAll('.flip-card'),         'is-flipped');
      bindExclusiveFlip(document.querySelectorAll('.speaker-flip-card'), 'flipped');

      /* Click outside any card → close the active one */
      document.addEventListener('click', function (e) {
        if (activeCard && !activeCard.contains(e.target)) {
          activeCard.classList.remove('flipped', 'is-flipped');
          activeCard.setAttribute('aria-pressed', 'false');
          activeCard = null;
        }
      });
    });