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

// JS: Original speaker flip-card logic preserved for the speaker section
// Script to transfer active speakers from the old hidden grid to the new flip card grid
document.addEventListener('DOMContentLoaded', function () {
    const oldGrid = document.querySelector('#old-speakers-backup .grid');
    const newGrid = document.getElementById('newSpeakersGrid');
    const oldCards = oldGrid.querySelectorAll('.grid-item');
    
    let html = '';
    let count = 0;
    
    oldCards.forEach(function(item) {
        // Ensure it's not an empty or fully commented block by checking for card element
        const card = item.querySelector('.card');
        if (card) {
            const img = card.querySelector('.card-img');
            const name = card.querySelector('.card-content h1');
            const desc = card.querySelector('.card-content p');
            
            if (img && name && desc) {
                const isVisible = count < 8 ? 'visible' : '';
                
                html += `
                <div class="speaker-flip-card ${isVisible}">
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
    
    // Handle show more button logic for the new grid
    const showMoreBtn = document.getElementById('newShowMoreBtn');
    const showMoreBtnWrapper = document.getElementById('newShowMoreBtnWrapper');
    
    if (count <= 8) {
        showMoreBtnWrapper.style.display = 'none';
    }
    
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function () {
            const cards = newGrid.querySelectorAll('.speaker-flip-card');
            cards.forEach(function(card) {
                card.classList.add('visible');
            });
            showMoreBtnWrapper.style.display = 'none';
        });
    }
});