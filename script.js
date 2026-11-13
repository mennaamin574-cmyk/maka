/**
 * ==============================================================================
 * شركة مكة لعزل الخزانات والأسطح - Makka Insulation Company
 * Main JavaScript File: Clean, Modular, and High-Performance
 * Features: Mobile Drawer, Sticky Header, ScrollSpy, IntersectionObserver Reveal,
 * Animated Stats Counter, Gallery Filtering, and Lightbox Modal
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. STICKY HEADER & SCROLL BEHAVIOR
       ========================================================================== */
    const header = document.getElementById('header');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Toggle scrolled class for header backdrop & shadow
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Toggle Scroll to Top button visibility
        if (scrollTopBtn) {
            if (scrollY > 400) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Scroll to Top action
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       2. MOBILE DRAWER NAVIGATION
       ========================================================================== */
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobileBackdrop = document.getElementById('mobileBackdrop');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const openDrawer = () => {
        if (!hamburgerBtn || !mobileDrawer || !mobileBackdrop) return;
        hamburgerBtn.classList.add('active');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        mobileDrawer.classList.add('open');
        mobileBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent page scroll behind drawer
    };

    const closeDrawer = () => {
        if (!hamburgerBtn || !mobileDrawer || !mobileBackdrop) return;
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileDrawer.classList.remove('open');
        mobileBackdrop.classList.remove('open');
        document.body.style.overflow = '';
    };

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            if (mobileDrawer.classList.contains('open')) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });
    }

    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
    if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeDrawer);

    // Close mobile drawer on link click
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeDrawer();
        });
    });

    /* ==========================================================================
       3. SMOOTH SCROLLING & ACTIVE LINK HIGHLIGHTING (SCROLLSPY)
       ========================================================================== */
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    const sections = document.querySelectorAll('section[id], header[id]');
    const desktopNavLinks = document.querySelectorAll('.nav-link');

    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight + 5;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active nav link on scroll
    const updateActiveNavLink = () => {
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                desktopNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveNavLink, { passive: true });

    /* ==========================================================================
       4. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealElements = document.querySelectorAll('[data-reveal]');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Animate once
                }
            });
        }, {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    /* ==========================================================================
       5. ANIMATED STATS COUNTER
       ========================================================================== */
    const statNumbers = document.querySelectorAll('.stat-number');
    let counted = false;

    const animateCounters = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds duration
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target.toLocaleString('ar-SA');
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current).toLocaleString('ar-SA');
                }
            }, stepTime);
        });
    };

    const statsSection = document.querySelector('.hero-stats-bar');
    if (statsSection && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counted) {
                    counted = true;
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    }

    /* ==========================================================================
       6. GALLERY FILTERING ("أعمالنا")
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button state
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.92)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    /* ==========================================================================
       7. GALLERY LIGHTBOX MODAL
       ========================================================================== */
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxClose = document.getElementById('lightboxClose');
    const zoomButtons = document.querySelectorAll('.gallery-zoom-btn');

    const openLightbox = (imgSrc, title, desc) => {
        if (!lightboxModal || !lightboxImg || !lightboxTitle || !lightboxDesc) return;
        lightboxImg.src = imgSrc;
        lightboxImg.alt = title;
        lightboxTitle.textContent = title;
        lightboxDesc.textContent = desc;
        lightboxModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        if (!lightboxModal) return;
        lightboxModal.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(() => {
            if (lightboxImg) lightboxImg.src = '';
        }, 300);
    };

    zoomButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const imgSrc = btn.getAttribute('data-img');
            const title = btn.getAttribute('data-title');
            const desc = btn.getAttribute('data-desc');
            openLightbox(imgSrc, title, desc);
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

    // Close when clicking backdrop outside content
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('open')) {
            closeLightbox();
        }
    });

    console.log('موقع مكة لعزل الخزانات والأسطح جاهز ويعمل بكفاءة وسرعة.');
});
