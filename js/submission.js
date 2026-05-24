/**
 * submission.js
 * Handles flip card exclusive toggling for publication cover cards.
 */
 
// ── Flip Cards ──────────────────────────────────────────────────────────────
// Only one card can be open at a time.
// Opening a new card automatically closes the previously open one.
 
let activeCard = null;
 
document.querySelectorAll('.flip-card').forEach(card => {
 
    // Make keyboard-accessible
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
 
    // Click / tap handler
    card.addEventListener('click', () => {
        if (card === activeCard) {
            // Tap the same card → close it
            card.classList.remove('is-flipped');
            activeCard = null;
        } else {
            // Close the previously open card, open the new one
            if (activeCard) activeCard.classList.remove('is-flipped');
            card.classList.add('is-flipped');
            activeCard = card;
        }
    });
 
    // Enter / Space for keyboard users
    card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
        }
    });
});