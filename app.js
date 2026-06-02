/* ==========================================================================
   DESIGN & CO — DYNAMIC WEB LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------------
       01. Sticky Header Shrink & Border Active-States
       -------------------------------------------------------------------------- */
    const header = document.getElementById('header');

    const handleScrollHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScrollHeader);
    handleScrollHeader(); // Run on startup in case page loads scrolled

    /* --------------------------------------------------------------------------
       02. Premium Light/Dark Theme Switcher with Persistent Memory
       -------------------------------------------------------------------------- */
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Always force light-mode for the clean, premium white design
    body.classList.add('light-mode');
    body.classList.remove('dark-mode');

    /* --------------------------------------------------------------------------
       03. Mobile Overlay & Menu Trigger
       -------------------------------------------------------------------------- */
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    const toggleMobileMenu = () => {
        mobileToggle.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        // Prevent background scrolling when mobile menu is active
        if (mobileOverlay.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = 'auto';
        }
    };

    mobileToggle.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking navigation links
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileOverlay.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    /* --------------------------------------------------------------------------
       04. Smooth Project Category Filtering with Animations
       -------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------
       04. Smooth Project Category Filtering & Slider Pagination Carousel
       -------------------------------------------------------------------------- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const track = document.getElementById('projects-track');
    const prevBtn = document.getElementById('project-prev');
    const nextBtn = document.getElementById('project-next');

    let currentPageIndex = 0;

    // Helper to get number of items visible per page based on responsive breakpoints
    const getCardsPerPage = () => {
        if (window.innerWidth > 1024) return 3;
        if (window.innerWidth > 768) return 2;
        return 1;
    };

    // Helper to get the list of currently visible project cards under the current filter
    const getVisibleCards = () => {
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        return Array.from(projectCards).filter(card => {
            const cat = card.getAttribute('data-category');
            return activeFilter === 'all' || cat === activeFilter;
        });
    };

    // Main render function to position the track and update button states
    const updateSlider = (smooth = true) => {
        const visibleCards = getVisibleCards();
        const cardsPerPage = getCardsPerPage();
        const maxPageIndex = Math.max(0, Math.ceil(visibleCards.length / cardsPerPage) - 1);

        // Bound currentPageIndex to valid pages
        if (currentPageIndex > maxPageIndex) {
            currentPageIndex = maxPageIndex;
        }
        if (currentPageIndex < 0) {
            currentPageIndex = 0;
        }

        // Calculate translation amount
        if (visibleCards.length > 0) {
            const cardWidth = visibleCards[0].getBoundingClientRect().width;
            const gap = 40;
            const translateAmt = currentPageIndex * (cardWidth * cardsPerPage + gap * cardsPerPage);

            track.style.transition = smooth ? 'transform var(--transition-smooth)' : 'none';
            track.style.transform = `translateX(-${translateAmt}px)`;
        } else {
            track.style.transform = 'translateX(0px)';
        }

        // Enable/Disable navigation buttons based on boundary states
        prevBtn.disabled = (currentPageIndex === 0);
        nextBtn.disabled = (currentPageIndex >= maxPageIndex);
    };

    // Navigation events
    nextBtn.addEventListener('click', () => {
        currentPageIndex++;
        updateSlider();
    });

    prevBtn.addEventListener('click', () => {
        currentPageIndex--;
        updateSlider();
    });

    // Handle Category Filtering
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from other buttons and set active
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Hide/Show items using opacity/scale transitions
            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 350);
                }
            });

            // Reset to page 0 when filter changes and update position
            currentPageIndex = 0;
            // Let display/opacity animations resolve before translating to avoid visual jumps
            setTimeout(() => {
                updateSlider(false);
            }, 360);
        });
    });

    // Adjust slide positions and boundaries on window resize
    window.addEventListener('resize', () => {
        updateSlider(false);
    });

    // Run initial slider setup on startup
    setTimeout(() => {
        updateSlider(false);
    }, 100);

    /* --------------------------------------------------------------------------
       05. Dynamic FAQ Accordions (scrollHeight Calculations)
       -------------------------------------------------------------------------- */
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            const content = trigger.nextElementSibling;

            // Close all currently open accordions first (Single Accordion Behavior)
            faqTriggers.forEach(t => {
                t.setAttribute('aria-expanded', 'false');
                t.nextElementSibling.style.maxHeight = '0px';
            });

            if (!isExpanded) {
                trigger.setAttribute('aria-expanded', 'true');
                // Calculate scrollHeight dynamically to enable fluid height transitions
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    /* --------------------------------------------------------------------------
       06. Scroll Reveal Micro-Animations (Intersection Observer)
       -------------------------------------------------------------------------- */
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve since we only want the entrance animation once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before the element rises
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* --------------------------------------------------------------------------
       07. Premium Form Validations & Simulated Submission Handling
       -------------------------------------------------------------------------- */
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // Simple email format checker
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Validates an individual form field
    const validateField = (input, errorEl) => {
        const value = input.value.trim();
        const parent = input.parentElement;

        if (!value) {
            parent.classList.add('invalid');
            return false;
        }

        if (input.type === 'email' && !isValidEmail(value)) {
            parent.classList.add('invalid');
            errorEl.textContent = 'Please enter a valid email address';
            return false;
        }

        // Clean error states if completely valid
        parent.classList.remove('invalid');
        return true;
    };

    // Add immediate input checkers (Real-time feedback)
    const inputsToWatch = [
        { id: 'form-name', error: 'name-error' },
        { id: 'form-email', error: 'email-error' },
        { id: 'form-message', error: 'message-error' }
    ];

    inputsToWatch.forEach(field => {
        const input = document.getElementById(field.id);
        const errorEl = document.getElementById(field.error);

        input.addEventListener('input', () => {
            validateField(input, errorEl);
        });
    });

    // Form Submit Handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isFormValid = true;

        // Perform full final sweep check on submit
        inputsToWatch.forEach(field => {
            const input = document.getElementById(field.id);
            const errorEl = document.getElementById(field.error);
            if (!validateField(input, errorEl)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            formStatus.textContent = 'Please correct the highlighted fields before submitting.';
            formStatus.className = 'form-status error';
            formStatus.style.opacity = '1';
            return;
        }

        // Trigger Submitting states
        form.classList.add('submitting');
        formStatus.style.opacity = '0';

        // Simulate modern API server delay (1.5 seconds)
        setTimeout(() => {
            form.classList.remove('submitting');
            formStatus.textContent = 'Thank you! Your message has been sent successfully. We will reach out shortly.';
            formStatus.className = 'form-status success';
            formStatus.style.opacity = '1';

            // Clean out text inputs
            form.reset();
        }, 1500);
    });
});
