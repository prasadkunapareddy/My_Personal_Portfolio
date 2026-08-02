'use strict';

/*
 * Prasad Portfolio — regenerated JavaScript
 * Works with the current index.html and style.css.
 * No external JavaScript library is required.
 */

document.documentElement.classList.add('js-enabled');

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    const hasFinePointer = window.matchMedia(
        '(hover: hover) and (pointer: fine)'
    ).matches;

    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('#nav-toggle');
    const navLinks = Array.from(
        document.querySelectorAll('.nav-links a[href^="#"]')
    );
    const sections = Array.from(
        document.querySelectorAll('header[id], main section[id]')
    );
    const contactForm = document.querySelector('.contact-form');

    initScrollProgress();
    initSmoothNavigation();
    initRevealAnimations();
    initHeroTextRotation();
    initCardSpotlight();
    initHeaderGlowMovement();
    initContactForm();
    initBackToTopButton();
    initImages();
    updateCurrentYear();

    /**
     * Adds the progress line and updates navigation styles while scrolling.
     * The same animation frame also updates the active menu item, reducing
     * the amount of work performed during scroll events.
     */
    function initScrollProgress() {
        let progressBar = document.querySelector('.scroll-progress');

        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            progressBar.setAttribute('aria-hidden', 'true');
            document.body.prepend(progressBar);
        }

        let frameRequested = false;

        const updateScrollEffects = () => {
            const pageHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            const progress = pageHeight > 0
                ? Math.min(Math.max(window.scrollY / pageHeight, 0), 1)
                : 0;

            progressBar.style.width = `${progress * 100}%`;
            navbar?.classList.toggle('is-scrolled', window.scrollY > 24);

            updateActiveNavigation();
            frameRequested = false;
        };

        const requestUpdate = () => {
            if (frameRequested) return;
            frameRequested = true;
            window.requestAnimationFrame(updateScrollEffects);
        };

        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', requestUpdate, { passive: true });
        updateScrollEffects();
    }

    /**
     * Smoothly scrolls internal links with a navbar offset. This prevents a
     * section heading from being hidden beneath the fixed navigation bar.
     */
    function initSmoothNavigation() {
        const internalLinks = Array.from(
            document.querySelectorAll('a[href^="#"]')
        );

        const closeMobileMenu = () => {
            if (!navToggle) return;
            navToggle.checked = false;
            navToggle.setAttribute('aria-expanded', 'false');
        };

        navToggle?.setAttribute('aria-expanded', String(navToggle.checked));

        navToggle?.addEventListener('change', () => {
            navToggle.setAttribute('aria-expanded', String(navToggle.checked));
        });

        internalLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                const targetId = link.getAttribute('href');

                if (!targetId || targetId === '#') return;

                const target = document.querySelector(targetId);
                if (!target) return;

                event.preventDefault();
                closeMobileMenu();

                const navbarHeight = navbar?.offsetHeight ?? 0;
                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    navbarHeight -
                    18;

                window.scrollTo({
                    top: Math.max(targetPosition, 0),
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });

                if (history.replaceState) {
                    history.replaceState(null, '', targetId);
                }
            });
        });

        document.addEventListener('click', (event) => {
            if (!navToggle?.checked || !navbar) return;
            if (!navbar.contains(event.target)) closeMobileMenu();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeMobileMenu();
        });
    }

    /**
     * Finds the section closest to the upper-middle part of the viewport and
     * highlights its matching navigation link.
     */
    function updateActiveNavigation() {
        if (!sections.length || !navLinks.length) return;

        const navbarHeight = navbar?.offsetHeight ?? 0;
        const marker = window.scrollY + navbarHeight + window.innerHeight * 0.22;

        let activeSection = sections[0];

        sections.forEach((section) => {
            if (section.offsetTop <= marker) activeSection = section;
        });

        navLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${activeSection.id}`;
            link.classList.toggle('is-active', isActive);

            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    /**
     * Reveals content once as it enters the viewport. Staggering is limited
     * within each visual group so content never waits too long to appear.
     */
    function initRevealAnimations() {
        const revealItems = Array.from(document.querySelectorAll('.reveal'));

        revealItems.forEach((item, index) => {
            item.style.setProperty('--reveal-delay', `${(index % 3) * 90}ms`);
        });

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            revealItems.forEach((item) => item.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries, revealObserver) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -45px 0px'
            }
        );

        revealItems.forEach((item) => observer.observe(item));
    }

    /**
     * Rotates the highlighted hero sentence using a fade transition rather
     * than a typing animation. This avoids frequent line reflow and overlap.
     */
    function initHeroTextRotation() {
        const heroText = document.querySelector('.gradient-text');
        if (!heroText || prefersReducedMotion) return;

        const messages = [
            'memorable digital experiences.',
            'responsive web applications.',
            'clear data-driven solutions.',
            'modern user-friendly interfaces.'
        ];

        let currentIndex = Math.max(messages.indexOf(heroText.textContent.trim()), 0);
        let rotationTimer;

        const rotateText = () => {
            heroText.classList.add('is-changing');

            window.setTimeout(() => {
                currentIndex = (currentIndex + 1) % messages.length;
                heroText.textContent = messages[currentIndex];
                heroText.classList.remove('is-changing');
            }, 320);
        };

        const startRotation = () => {
            if (rotationTimer) return;
            rotationTimer = window.setInterval(rotateText, 3800);
        };

        const stopRotation = () => {
            window.clearInterval(rotationTimer);
            rotationTimer = undefined;
        };

        heroText.setAttribute('aria-live', 'polite');
        startRotation();

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stopRotation();
            else startRotation();
        });
    }

    /**
     * Adds a subtle cursor-following light to cards. No card is translated or
     * scaled here, so nearby text and images remain in their own space.
     */
    function initCardSpotlight() {
        if (!hasFinePointer || prefersReducedMotion) return;

        const cards = document.querySelectorAll(
            '.hero-card, .service-card, .project-card, .experience-card, .contact-shell'
        );

        cards.forEach((card) => {
            card.classList.add('interactive-card');
            let pointerFrame;

            card.addEventListener('pointermove', (event) => {
                if (pointerFrame) cancelAnimationFrame(pointerFrame);

                pointerFrame = requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = ((event.clientX - rect.left) / rect.width) * 100;
                    const y = ((event.clientY - rect.top) / rect.height) * 100;

                    card.style.setProperty('--mouse-x', `${x}%`);
                    card.style.setProperty('--mouse-y', `${y}%`);
                });
            });

            card.addEventListener('pointerleave', () => {
                card.style.removeProperty('--mouse-x');
                card.style.removeProperty('--mouse-y');
            });
        });
    }

    /**
     * Moves only the decorative header glow elements. Content itself stays
     * fixed, avoiding motion-related layout or overlap problems.
     */
    function initHeaderGlowMovement() {
        if (!hasFinePointer || prefersReducedMotion) return;

        const header = document.querySelector('.site-header');
        const glowOne = document.querySelector('.header-glow-one');
        const glowTwo = document.querySelector('.header-glow-two');

        if (!header || !glowOne || !glowTwo) return;

        let glowFrame;

        header.addEventListener('pointermove', (event) => {
            if (glowFrame) cancelAnimationFrame(glowFrame);

            glowFrame = requestAnimationFrame(() => {
                const rect = header.getBoundingClientRect();
                const horizontal = (event.clientX - rect.left) / rect.width - 0.5;
                const vertical = (event.clientY - rect.top) / rect.height - 0.5;

                glowOne.style.transform = `translate3d(${horizontal * 18}px, ${vertical * 14}px, 0)`;
                glowTwo.style.transform = `translate3d(${horizontal * -14}px, ${vertical * -10}px, 0)`;
            });
        });

        header.addEventListener('pointerleave', () => {
            glowOne.style.transform = '';
            glowTwo.style.transform = '';
        });
    }

    /**
     * Validates the form and opens the visitor's default email application.
     * Replace this block with EmailJS/Formspree later for direct submission.
     */
    function initContactForm() {
        if (!contactForm) return;

        let status = contactForm.querySelector('.form-status');

        if (!status) {
            status = document.createElement('p');
            status.className = 'form-status';
            status.setAttribute('role', 'status');
            status.setAttribute('aria-live', 'polite');
            contactForm.append(status);
        }

        const fields = Array.from(
            contactForm.querySelectorAll('input, textarea')
        );

        fields.forEach((field) => {
            field.addEventListener('input', () => {
                field.classList.remove('is-invalid');
                status.textContent = '';
                status.className = 'form-status';
            });

            field.addEventListener('blur', () => {
                field.classList.toggle('is-invalid', !field.checkValidity());
            });
        });

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            fields.forEach((field) => {
                field.classList.toggle('is-invalid', !field.checkValidity());
            });

            const invalidField = fields.find((field) => !field.checkValidity());

            if (invalidField) {
                invalidField.focus();
                status.textContent = 'Please complete all required fields correctly.';
                status.className = 'form-status is-error';
                return;
            }

            const formData = new FormData(contactForm);
            const name = String(formData.get('name') || '').trim();
            const email = String(formData.get('email') || '').trim();
            const subject = String(
                formData.get('subject') || 'Portfolio enquiry'
            ).trim();
            const message = String(formData.get('message') || '').trim();

            const mailSubject = encodeURIComponent(
                subject || 'Portfolio enquiry'
            );
            const mailBody = encodeURIComponent(
                `Hello Prasad,\n\n${message}\n\nRegards,\n${name}\n${email}`
            );

            status.textContent = 'Success unlocked! Your queries are now with us...';
            status.className = 'form-status is-success';

            window.location.href =
                `mailto:prasadkunapareddy9985@gmail.com?subject=${mailSubject}&body=${mailBody}`;
        });
    }

    /** Creates a floating back-to-top control after the visitor scrolls. */
    function initBackToTopButton() {
        let button = document.querySelector('.back-to-top');

        if (!button) {
            button = document.createElement('button');
            button.className = 'back-to-top';
            button.type = 'button';
            button.setAttribute('aria-label', 'Back to top');
            button.innerHTML =
                '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';
            document.body.append(button);
        }

        let frameRequested = false;

        const updateVisibility = () => {
            button.classList.toggle('is-visible', window.scrollY > 650);
            frameRequested = false;
        };

        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });

        window.addEventListener(
            'scroll',
            () => {
                if (frameRequested) return;
                frameRequested = true;
                requestAnimationFrame(updateVisibility);
            },
            { passive: true }
        );

        updateVisibility();
    }

    /** Improves loading behavior for non-hero images. */
    function initImages() {
        const images = document.querySelectorAll('main img');

        images.forEach((image) => {
            image.loading = 'lazy';
            image.decoding = 'async';

            const markLoaded = () => image.classList.add('is-loaded');
            image.addEventListener('load', markLoaded, { once: true });

            if (image.complete) markLoaded();
        });
    }

    /** Keeps the footer copyright year current. */
    function updateCurrentYear() {
        const currentYear = document.querySelector('#current-year');
        if (currentYear) {
            currentYear.textContent = String(new Date().getFullYear());
        }
    }
});
