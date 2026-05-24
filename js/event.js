// JS: Mobile navigation behavior for the new reference-style header
document.addEventListener('DOMContentLoaded', function () {
    const mobileToggle = document.getElementById('mobileToggle');
    const headerNav = document.getElementById('headerNav');
    const dropdowns = document.querySelectorAll('.dropdown');

    if (mobileToggle && headerNav) {
        mobileToggle.addEventListener('click', function () {
            headerNav.classList.toggle('active');
        });
    }

    dropdowns.forEach(function (dropdown) {
        const trigger = dropdown.querySelector(':scope > a');
        if (trigger) {
            trigger.addEventListener('click', function (event) {
                if (window.innerWidth <= 860 && dropdown.querySelector('.dropdown-menu')) {
                    event.preventDefault();
                    dropdown.classList.toggle('open');
                }
            });
        }
    });
});

// JS: Speaker flip-card logic — exclusive toggle (only one card open at a time)
// Also transfers active speakers from the old hidden grid to the new flip card grid
document.addEventListener('DOMContentLoaded', function () {
    const oldGrid = document.querySelector('#old-speakers-backup .grid');
    const newGrid = document.getElementById('newSpeakersGrid');
    const oldCards = oldGrid.querySelectorAll('.grid-item');

    let html = '';
    let count = 0;

    oldCards.forEach(function (item) {
        const card = item.querySelector('.card');
        if (card) {
            const img  = card.querySelector('.card-img');
            const name = card.querySelector('.card-content h1');
            const desc = card.querySelector('.card-content p');

            if (img && name && desc) {
                const isVisible = count < 8 ? 'visible' : '';

                html += `
                <div class="speaker-flip-card ${isVisible}" tabindex="0" role="button">
                    <div class="speaker-flip-card-inner">
                        <div class="speaker-flip-card-front">
                            <img src="${img.getAttribute('src')}" alt="${name.innerText}">
                        </div>
                        <div class="speaker-flip-card-back">
                            <h3>${name.innerText}</h3>
                            <p>${desc.innerText}</p>
                        </div>
                    </div>
                </div>
                `;
                count++;
            }
        }
    });

    newGrid.innerHTML = html;

    // ── Exclusive flip logic ─────────────────────────────────────────────────
    // Attach after innerHTML is set so all cards exist in the DOM.
    let activeSpeakerCard = null;

    function initSpeakerFlipCards() {
        newGrid.querySelectorAll('.speaker-flip-card').forEach(function (card) {
            // Skip already-bound cards (e.g. after Show More injects more)
            if (card.dataset.flipBound) return;
            card.dataset.flipBound = 'true';

            card.addEventListener('click', function () {
                if (card === activeSpeakerCard) {
                    // Tap same card → close it
                    card.classList.remove('flipped');
                    activeSpeakerCard = null;
                } else {
                    // Close previous, open new
                    if (activeSpeakerCard) activeSpeakerCard.classList.remove('flipped');
                    card.classList.add('flipped');
                    activeSpeakerCard = card;
                }
            });

            // Keyboard: Enter / Space
            card.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
    }

    initSpeakerFlipCards();
    // ────────────────────────────────────────────────────────────────────────

    // Handle Show More button
    const showMoreBtn        = document.getElementById('newShowMoreBtn');
    const showMoreBtnWrapper = document.getElementById('newShowMoreBtnWrapper');

    if (count <= 8) {
        showMoreBtnWrapper.style.display = 'none';
    }

    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function () {
            newGrid.querySelectorAll('.speaker-flip-card').forEach(function (card) {
                card.classList.add('visible');
            });
            showMoreBtnWrapper.style.display = 'none';

            // Re-run init so newly visible cards also get the exclusive flip logic
            initSpeakerFlipCards();
        });
    }
});

// JS: Fix banner loading glitch
document.addEventListener('DOMContentLoaded', () => {
    const bannerObserver = new MutationObserver(() => {
        const bannerImgs = document.querySelectorAll('#banner img');
        bannerImgs.forEach(bannerImg => {
            if (!bannerImg.dataset.loadHandled) {
                bannerImg.dataset.loadHandled = 'true';
                if (bannerImg.complete) {
                    bannerImg.classList.add('loaded');
                } else {
                    bannerImg.addEventListener('load', () => bannerImg.classList.add('loaded'));
                }
            }
        });
    });
    const bannerContainer = document.getElementById('banner') || document.body;
    bannerObserver.observe(bannerContainer, { childList: true, subtree: true });
});