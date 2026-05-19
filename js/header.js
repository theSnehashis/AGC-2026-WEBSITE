
(function () {
  const toggle  = document.getElementById('navToggle');
  const nav     = document.getElementById('headerNav');
  const header  = document.querySelector('.site-header');
  const MOBILE  = 860;

  /* ── ACTIVE NAV LINK based on current page ── */
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-list > li > a').forEach(function (link) {
    const linkPath = link.getAttribute('href');
    if (!linkPath || linkPath.startsWith('#')) return;

    const normalizedLink = linkPath.replace(/\/$/, '') || '/';

    if (normalizedLink === currentPath ||
        (currentPath.endsWith(normalizedLink) && normalizedLink !== '/')) {
      link.classList.add('active');
    }
  });

  /* ── Open / close nav ── */
  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = nav.classList.toggle('open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  /* ── Close nav when tapping outside ── */
  document.addEventListener('click', function (e) {
    if (window.innerWidth > MOBILE) return;
    if (!header.contains(e.target)) {
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