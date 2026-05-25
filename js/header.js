(function () {
  const toggle  = document.getElementById('navToggle');
  const nav     = document.getElementById('headerNav');
  const header  = document.querySelector('.site-header');
  const MOBILE  = 860;

  /* ── Helper: reset all inner dropdowns ── */
  function closeAllDropdowns() {
    document.querySelectorAll('.has-dropdown.open').forEach(function (li) {
      li.classList.remove('open');
    });
  }

  /* ── Helper: close the main nav ── */
  function closeNav() {
    nav.classList.remove('open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    closeAllDropdowns();
  }

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

    // Reset inner dropdowns when main nav closes
    if (!isOpen) closeAllDropdowns();
  });

  /* ── Close nav when tapping outside ── */
  document.addEventListener('click', function (e) {
    if (window.innerWidth > MOBILE) return;
    if (!header.contains(e.target)) closeNav();
  });

  /* ── Accordion dropdowns on mobile ── */
  document.querySelectorAll('.has-dropdown > a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= MOBILE) {
        e.preventDefault();
        const li = this.closest('li');
        const isAlreadyOpen = li.classList.contains('open');

        // Close all open dropdowns first
        closeAllDropdowns();

        // Re-open only if it wasn't already open (toggle behaviour)
        if (!isAlreadyOpen) li.classList.add('open');
      }
    });
  });

  /* ── Close nav when a leaf link is tapped (mobile) ── */
  document.querySelectorAll('.nav-list > li:not(.has-dropdown) > a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= MOBILE) closeNav();
    });
  });

  /* ── Re-show nav on resize to desktop ── */
  window.addEventListener('resize', function () {
    if (window.innerWidth > MOBILE) closeNav();
  });
})();