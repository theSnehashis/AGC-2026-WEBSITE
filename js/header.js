(function () {
  const toggle  = document.getElementById('navToggle');
  const nav     = document.getElementById('headerNav');
  const header  = document.querySelector('.site-header');
  const MOBILE  = 860;
 
  /* ── Open / close nav ── */
  toggle.addEventListener('click', function (e) {
    e.stopPropagation();                        // don't bubble to document
    const isOpen = nav.classList.toggle('open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });
 
  /* ── FIX #1: Close nav when tapping outside ── */
  document.addEventListener('click', function (e) {
    if (window.innerWidth > MOBILE) return;    // only on mobile
    if (!header.contains(e.target)) {          // tap is outside entire header
      nav.classList.remove('open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
 
  /* ── Accordion dropdowns on mobile ── */
  document.querySelectorAll('.has-dropdown > a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= MOBILE) {
        e.preventDefault();
        const li = this.closest('li');
        li.classList.toggle('open');
      }
    });
  });
 
  /* ── Close nav when a leaf link is tapped (mobile) ── */
  document.querySelectorAll('.nav-list > li:not(.has-dropdown) > a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= MOBILE) {
        nav.classList.remove('open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
 
  /* ── Re-show nav on resize to desktop ── */
  window.addEventListener('resize', function () {
    if (window.innerWidth > MOBILE) {
      nav.classList.remove('open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();