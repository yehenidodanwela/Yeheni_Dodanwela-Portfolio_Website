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

    // Project details image lightbox
    initializeProjectImageLightbox();

    // Initialize typed subtitle
    initTypedSubtitle(['Computer Science Undergraduate', 'Aspiring Full-Stack Software Engineer', 'UI/UX Enthusiast'], 100, 1000);

    // Setup scroll reveal targets (add class to common elements)
    document.querySelectorAll('.hero-title, .hero-subtitle, .Hero-text, .hero-img, #projects .project-card, #journey .timeline-item, #contact .contact-panel, #contact .contact-form-panel').forEach(function(el){
        el.classList.add('reveal-on-scroll');
    });
    initScrollReveal();

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

/* Typed subtitle helper: cycles through phrases */
function initTypedSubtitle(phrases, speed, pause) {
    var el = document.getElementById('typed-subtitle');
    if (!el) return;
    var idx = 0, charIdx = 0, deleting = false;
    // Ensure classes for cursor state
    el.classList.remove('typing', 'static-cursor');

    function tick() {
        var current = phrases[idx];
        if (!deleting) {
            // typing phase: show blinking cursor
            el.classList.add('typing');
            el.classList.remove('static-cursor');
            el.textContent = current.slice(0, charIdx + 1);
            charIdx++;
            if (charIdx === current.length) {
                // reached full word: show a static cursor (no blink) during pause
                deleting = true;
                el.classList.remove('typing');
                el.classList.add('static-cursor');
                setTimeout(tick, pause);
                return;
            }
        } else {
            // deleting phase: restore blinking cursor
            el.classList.add('typing');
            el.classList.remove('static-cursor');
            el.textContent = current.slice(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) { deleting = false; idx = (idx + 1) % phrases.length; }
        }
        setTimeout(tick, deleting ? Math.max(30, speed / 2) : speed);
    }

    tick();
}

/* Scroll reveal using IntersectionObserver */
function initScrollReveal() {
    var observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
            if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal-on-scroll').forEach(function(el){ observer.observe(el); });
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

function initializeProjectImageLightbox() {
    var detailImages = document.querySelectorAll('.project-details .carousel-item img');
    if (!detailImages.length) return;

    detailImages.forEach(function (img) {
        img.classList.add('project-detail-zoomable');
    });

    var overlay = document.getElementById('project-image-lightbox');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'project-image-lightbox';
        overlay.className = 'project-image-lightbox';
        overlay.innerHTML = '<button type="button" class="project-image-lightbox__close" aria-label="Close image preview">&times;</button><button type="button" class="project-image-lightbox__nav project-image-lightbox__nav--prev" aria-label="Previous image">&#10094;</button><img class="project-image-lightbox__image" alt="Project image preview"><button type="button" class="project-image-lightbox__nav project-image-lightbox__nav--next" aria-label="Next image">&#10095;</button>';
        document.body.appendChild(overlay);

        overlay.addEventListener('click', function (event) {
            if (event.target === overlay || event.target.classList.contains('project-image-lightbox__close')) {
                overlay.classList.remove('is-open');
                return;
            }

            if (event.target.classList.contains('project-image-lightbox__nav--prev')) {
                showLightboxImage(activeIndex - 1);
            }

            if (event.target.classList.contains('project-image-lightbox__nav--next')) {
                showLightboxImage(activeIndex + 1);
            }
        });

        document.addEventListener('keydown', function (event) {
            if (!overlay.classList.contains('is-open')) return;

            if (event.key === 'Escape') {
                overlay.classList.remove('is-open');
            }

            if (event.key === 'ArrowLeft') {
                showLightboxImage(activeIndex - 1);
            }

            if (event.key === 'ArrowRight') {
                showLightboxImage(activeIndex + 1);
            }
        });
    }

    var overlayImage = overlay.querySelector('.project-image-lightbox__image');
    var activeIndex = 0;

    function showLightboxImage(index) {
        if (!detailImages.length) return;
        activeIndex = (index + detailImages.length) % detailImages.length;
        var activeImage = detailImages[activeIndex];
        overlayImage.src = activeImage.currentSrc || activeImage.src;
        overlayImage.alt = activeImage.alt || 'Project image preview';
        overlay.classList.add('is-open');
    }

    detailImages.forEach(function (img) {
        img.addEventListener('click', function () {
            activeIndex = Array.prototype.indexOf.call(detailImages, img);
            showLightboxImage(activeIndex);
        });
    });
}

  