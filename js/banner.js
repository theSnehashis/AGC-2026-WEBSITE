(function () {
    /* ── Constants ─────────────────────────────────────────── */
    const DISPLAY_DURATION  = 3000;
    const OUT_DURATION      = 450;
    const HINT_DELAY        = 600;
    const SESSION_KEY       = 'agc2023_overlay_shown';
    const isMobile          = /Android|iPhone|iPad|iPod|Touch/i.test(navigator.userAgent)
                              || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

    /* ── DOM ───────────────────────────────────────────────── */
    const card     = document.getElementById('heroCard');
    const progress = document.getElementById('heroProgress');
    const hintText = null; /* kept for compat reference below */

    hintText && (hintText.textContent = 'View Details');

    /* ── State ─────────────────────────────────────────────── */
    let overlayTimer   = null;
    let leaveTimer     = null;
    let overlayVisible = false;
    const alreadyShown = !!sessionStorage.getItem(SESSION_KEY);

    /* ═══════════════════════════════════════════════════════
       MOBILE MODAL
       ═══════════════════════════════════════════════════════ */
    const modal      = document.getElementById('mobileModal');
    const closeBtn   = document.getElementById('mobileModalClose');
    const detailsBtn = document.getElementById('mobileDetailsBtn');
    const exploreBtn = document.getElementById('mobileExploreBtn');
    let modalClosing = false;

    function getScrollbarWidth() {
        return window.innerWidth - document.documentElement.clientWidth;
    }

    function openModal() {
        /* Compensate for scrollbar disappearing to prevent layout shift */
        const sbw = getScrollbarWidth();
        if (sbw > 0) {
            document.body.style.paddingRight = sbw + 'px';
        }
        modal.style.display = 'flex';
        modal.offsetHeight; /* reflow */
        modal.classList.add('open');
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (modalClosing) return;
        modalClosing = true;
        modal.classList.add('closing');
        setTimeout(function () {
            modal.classList.remove('open', 'closing');
            modal.style.display = 'none';
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            modalClosing = false;
        }, 380);
    }

    if (detailsBtn) {
        detailsBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            openModal();
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });
    }

    if (exploreBtn) {
        exploreBtn.addEventListener('click', function () {
            closeModal();
        });
    }

    const sheet = document.getElementById('mobileModalSheet');
    if (sheet) {
        let touchStartY = 0;
        sheet.addEventListener('touchstart', function (e) {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        sheet.addEventListener('touchend', function (e) {
            const delta = e.changedTouches[0].clientY - touchStartY;
            if (delta > 80) closeModal();
        }, { passive: true });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
            closeModal();
        }
    });

    /* ═══════════════════════════════════════════════════════
       DESKTOP OVERLAY
       ═══════════════════════════════════════════════════════ */
    function showOverlay() {
        if (overlayVisible) return;
        clearTimeout(leaveTimer);

        progress.style.animation = 'none';
        progress.offsetHeight;
        progress.style.animation = '';

        card.classList.remove('overlay-leaving');
        card.classList.add('overlay-active');
        overlayVisible = true;

        clearTimeout(overlayTimer);
        overlayTimer = setTimeout(hideOverlay, DISPLAY_DURATION);
    }

    function hideOverlay() {
        if (!overlayVisible) return;
        clearTimeout(overlayTimer);

        card.classList.remove('overlay-active');
        card.classList.add('overlay-leaving');
        overlayVisible = false;

        leaveTimer = setTimeout(function () {
            card.classList.remove('overlay-leaving');
            setTimeout(function () {
                card.classList.add('show-hint');
            }, HINT_DELAY);
        }, OUT_DURATION);
    }

    /* Desktop only: hover trigger (once per session) + "View Details" button */
    if (!isMobile) {
        const hint = document.getElementById('heroHint');

        /* First hover auto-shows overlay once */
        let hoverTriggered = alreadyShown;
        if (alreadyShown) card.classList.add('show-hint');

        card.addEventListener('mouseenter', function () {
            if (!hoverTriggered) {
                hoverTriggered = true;
                sessionStorage.setItem(SESSION_KEY, '1');
                showOverlay();
            }
        });

        /* "View Details" button click — shows overlay for 3s */
        if (hint) {
            hint.addEventListener('click', function (e) {
                e.stopPropagation();
                showOverlay();
            });
        }
    }

    /* ── Adaptive image brightness ─────────────────────────── */
    const brightnessCache = new Map();

    function getImageSource(img) {
        return img.currentSrc || img.getAttribute('src') || '';
    }

    function getOverlayOpacity(avg) {
        if (avg >= 195) return 0.62;
        if (avg >= 160) return 0.54;
        if (avg >= 120) return 0.46;
        if (avg >= 90)  return 0.40;
        return 0.32;
    }

    function applyOverlayToMatchingSlides(src, opacity) {
        document.querySelectorAll('.hero-swiper .swiper-slide').forEach(function (slide) {
            const img = slide.querySelector('img');
            if (!img) return;
            if (getImageSource(img) === src || img.getAttribute('src') === src) {
                slide.style.setProperty('--adaptive-overlay-opacity', opacity.toFixed(2));
            }
        });
    }

    function analyzeSlideImage(img) {
        const src = getImageSource(img);
        if (!src) return;
        if (brightnessCache.has(src)) { applyOverlayToMatchingSlides(src, brightnessCache.get(src)); return; }

        const canvas = document.createElement('canvas');
        const ctx    = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) { applyOverlayToMatchingSlides(src, 0.5); return; }

        canvas.width = canvas.height = 48;
        try {
            ctx.drawImage(img, 0, 0, 48, 48);
            const data = ctx.getImageData(0, 0, 48, 48).data;
            let total = 0, count = 0;
            for (let i = 0; i < data.length; i += 16) {
                total += (data[i] + data[i+1] + data[i+2]) / 3;
                count++;
            }
            const avg     = count ? total / count : 128;
            const opacity = getOverlayOpacity(avg);
            brightnessCache.set(src, opacity);
            applyOverlayToMatchingSlides(src, opacity);
        } catch (e) {
            applyOverlayToMatchingSlides(src, 0.5);
        }
    }

    function setupAdaptiveHeroOverlay() {
        document.querySelectorAll('.hero-swiper .swiper-slide img').forEach(function (img) {
            const src = getImageSource(img);
            if (!src) return;
            if (brightnessCache.has(src)) { applyOverlayToMatchingSlides(src, brightnessCache.get(src)); return; }
            if (img.complete && img.naturalWidth > 0) {
                analyzeSlideImage(img);
            } else {
                img.addEventListener('load', function () { analyzeSlideImage(img); }, { once: true });
            }
        });
    }

    /* ── Swiper ─────────────────────────────────────────────── */
    new Swiper('.hero-swiper', {
        loop: true,
        speed: 1000,
        autoplay: { delay: 4200, disableOnInteraction: false },
        effect: 'fade',
        fadeEffect: { crossFade: true },
        allowTouchMove: true,
        touchStartPreventDefault: false,
        simulateTouch: true,
        pagination: { el: '.hero-swiper .swiper-pagination', clickable: true },
        navigation: {
            nextEl: '.hero-swiper .swiper-button-next',
            prevEl: '.hero-swiper .swiper-button-prev'
        },
        on: {
            init:                       function () { setupAdaptiveHeroOverlay(); },
            slideChangeTransitionStart:  function () { setupAdaptiveHeroOverlay(); }
        }
    });
})();