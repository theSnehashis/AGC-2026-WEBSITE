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