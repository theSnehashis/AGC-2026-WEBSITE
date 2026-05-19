document.addEventListener('DOMContentLoaded', function () {
    // Schedule Tabs Logic
    const tabBtns = document.querySelectorAll('.sch-tab-btn');
    const schContents = document.querySelectorAll('.sch-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            schContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and target content
            btn.classList.add('active');
            const targetEl = document.getElementById(target);
            if (targetEl) {
                targetEl.classList.add('active');
            }
        });
    });
});
