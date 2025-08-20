// Theme handling, filters, and EmailJS with safe guards

document.addEventListener('DOMContentLoaded', function () {
    // Apply initial theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);

    // Ensure theme is reapplied when navigating back/forward (BFCache)
    window.addEventListener('pageshow', function () {
        const current = localStorage.getItem('theme') || 'light';
        applyTheme(current);
    });

    // Toggle button
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
            const nowDark = !document.body.classList.contains('dark');
            document.body.classList.toggle('dark', nowDark);
            swapIcons(nowDark ? 'dark' : 'light');
            localStorage.setItem('theme', nowDark ? 'dark' : 'light');
        });
    }

    // Projects filter (index page)
    const projectFilterButtons = document.querySelectorAll('#projects .filter-btn');
    const projectCards = document.querySelectorAll('#projects .project-card');
    if (projectFilterButtons.length > 0 && projectCards.length > 0) {
        projectFilterButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                projectFilterButtons.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                const filterValue = btn.getAttribute('data-filter');
                document.querySelectorAll('#projects .project-card').forEach(function (card) {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Journey filter (index page)
    const journeyButtons = document.querySelectorAll('#journey .filter-btn');
    if (journeyButtons.length > 0) {
        journeyButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                document.querySelectorAll('#journey .filter-btn').forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                const category = btn.getAttribute('data-filter');
                document.querySelectorAll('#journey .journey-section').forEach(function (sec) { sec.classList.add('d-none'); });
                var target = document.querySelector('#journey .journey-section[data-category="' + category + '"]');
                if (target) target.classList.remove('d-none');
                // Clear any inline display styles inside journey sections (e.g., articles cards)
                document.querySelectorAll('#journey .project-card').forEach(function (card) { card.style.display = ''; });
            });
        });
    }

    // EmailJS (only if available and form exists)
    if (window.emailjs && typeof window.emailjs.init === 'function') {
        try { window.emailjs.init('lQ60aBDgv3mZCNgBA'); } catch (e) {}
    }
    var contactForm = document.getElementById('contact-form');
    if (contactForm && window.emailjs && typeof window.emailjs.sendForm === 'function') {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            window.emailjs.sendForm('service_gnujhvb', 'template_8pn7bga', contactForm)
                .then(function () {
                    var status = document.getElementById('form-status');
                    if (status) status.innerHTML = '✅ Message sent successfully!';
                    contactForm.reset();
                }, function (error) {
                    var status = document.getElementById('form-status');
                    if (status) status.innerHTML = '❌ Failed to send message. Please try again.';
                    console.error('EmailJS Error:', error);
                });
        });
    }
});

function applyTheme(theme) {
    var isDark = theme === 'dark';
    document.body.classList.toggle('dark', isDark);
    swapIcons(isDark ? 'dark' : 'light');
}

function swapIcons(theme) {
    var from = theme === 'dark' ? 'Light_Theme_Icons' : 'Dark_Theme_Icons';
    var to = theme === 'dark' ? 'Dark_Theme_Icons' : 'Light_Theme_Icons';
    var images = document.querySelectorAll('img');
    images.forEach(function (img) {
        var src = img.getAttribute('src');
        if (!src) return;
        if (src.indexOf('Images/' + from + '/') !== -1) {
            img.setAttribute('src', src.replace(from, to));
        }
    });
}

  