

// Flip card functionality
// Add tap/click interactivity for mobile-friendly flipping
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('is-flipped');
  });
});

// table functionality
const rows = document.querySelectorAll(".sponsor-table tbody tr");

rows.forEach((row) => {

    row.addEventListener("mouseenter", () => {
        row.style.cursor = "pointer";
    });

});

//yt js
document.querySelectorAll('.video-box').forEach(box => {
  box.addEventListener('mouseenter', () => {
    box.style.boxShadow = "0 6px 16px rgba(0,0,0,0.2)";
  });
  box.addEventListener('mouseleave', () => {
    box.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
  });
});