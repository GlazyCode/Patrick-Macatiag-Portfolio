/* ----------------------------------------------------------------
   GlazyCode Portfolio - Core Interactive Controller (Valentin Cheval Theme)
   ---------------------------------------------------------------- */

class PortfolioController {
    constructor() {
        this.initLoader();
        this.initCursor();
        this.initTimeGreeting();
        this.initTechStackParallax();
        this.initScrollObservers();
        this.initMobileMenu();
        this.initHeaderScroll();
        this.initMagneticEffects();
        this.initContactForm();
        this.initPhilosophyTyping();
        this.initProjectShowcase();
    }

    // 1. Dynamic Intro Loader
    initLoader() {
        const loader = document.querySelector('.loader-wrap');
        if (!loader) return;

        window.addEventListener('load', () => {
            // Give 1s delay to feel the elegant animation
            setTimeout(() => {
                loader.style.transform = 'translateY(-100%)';
                // Enable pointer events on interactive elements
                document.body.style.overflow = 'visible';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 1200);
            }, 1200);
        });
    }

    // 2. Custom Magnetic Lagging Cursor
    initCursor() {
        // Destroy existing cursors if re-initializing
        const existingCursor = document.querySelector('.custom-cursor');
        const existingDot = document.querySelector('.custom-cursor-dot');
        if (existingCursor) existingCursor.remove();
        if (existingDot) existingDot.remove();

        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        const cursorDot = document.createElement('div');
        cursorDot.className = 'custom-cursor-dot';

        document.body.appendChild(cursor);
        document.body.appendChild(cursorDot);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Move the small dot instantly
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Lerp function for lagging main circle cursor
        const animateCursor = () => {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;

            cursorX += dx * 0.15;
            cursorY += dy * 0.15;

            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;

            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Standard Hover Listeners
        const addCursorHoverListeners = () => {
            const links = document.querySelectorAll('a, button, .header__act, .form-btn');
            links.forEach(link => {
                link.addEventListener('mouseenter', () => {
                    document.body.classList.add('hover-link');
                });
                link.addEventListener('mouseleave', () => {
                    document.body.classList.remove('hover-link');
                });
            });

            const projects = document.querySelectorAll('.project-showcase__media, .project-showcase__title, .project-showcase__dot');
            projects.forEach(project => {
                project.addEventListener('mouseenter', () => {
                    document.body.classList.add('hover-project');
                });
                project.addEventListener('mouseleave', () => {
                    document.body.classList.remove('hover-project');
                });
            });

            const secretItems = document.querySelectorAll('.home__intro-company, .home__hero-scope-cta, .tech-stack-logo');
            secretItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    document.body.classList.add('hover-hidden');
                });
                item.addEventListener('mouseleave', () => {
                    document.body.classList.remove('hover-hidden');
                });
            });
        };

        addCursorHoverListeners();
        this.reinitHoverCursor = addCursorHoverListeners; // Store pointer to trigger after AJAX page load
    }

    // 3. Time-Based Greetings
    initTimeGreeting() {
        const greetingSpan = document.querySelector('.time-great');
        if (!greetingSpan) return;

        const currentHour = new Date().getHours();
        let greeting = 'morning';

        if (currentHour >= 12 && currentHour < 17) {
            greeting = 'afternoon';
        } else if (currentHour >= 17 || currentHour < 4) {
            greeting = 'evening';
        }

        greetingSpan.textContent = greeting;
    }

    // 4. Scroll-Triggered reveals (fades, slides, scales, staggers)
    initScrollObservers() {
        const elementsToReveal = document.querySelectorAll('.fade-in-blur, .reveal-up, .reveal-fade, .reveal-scale, .reveal-stagger');
        if (elementsToReveal.length === 0) return;

        const observerOptions = {
            root: null,
            threshold: 0.05,
            rootMargin: '0px 0px -8% 0px'
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;

                    if (target.classList.contains('reveal-stagger')) {
                        // Stagger children transition-delay
                        const children = target.children;
                        Array.from(children).forEach((child, index) => {
                            child.style.transitionDelay = `${index * 0.08}s`;
                        });
                    }

                    target.classList.add('visible');
                    obs.unobserve(target); // Trigger once
                }
            });
        }, observerOptions);

        elementsToReveal.forEach(block => {
            observer.observe(block);
        });

        // Portrait & Image scroll parallax
        this.initScrollParallax();

        // Navigation active state on scroll
        this.initNavHighlightOnScroll();
    }

    initNavHighlightOnScroll() {
        const sections = document.querySelectorAll('[id="swup"], #about, #project-showcase, #certificates');
        const navLinks = document.querySelectorAll('.header__menu-link, .mobile-nav-link');

        if (sections.length === 0) return;

        const updateActiveLink = () => {
            let currentSection = '';
            const scrollPos = window.scrollY + 100; // Offset for header

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });

            // Default to swup (home) if no section matched
            if (!currentSection && window.scrollY < 100) {
                currentSection = 'swup';
            }

            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (!href) return;

                const linkHash = href.includes('#') ? href.split('#')[1] : '';

                // Remove active from all
                link.classList.remove('active');

                // Add active if this link matches current section
                if (linkHash && linkHash === currentSection) {
                    link.classList.add('active');
                }
            });
        };

        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateActiveLink();
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Initial check
        updateActiveLink();

        // Also check on resize
        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll, { passive: true });
        window.removeEventListener('resize', updateActiveLink);
        window.addEventListener('resize', updateActiveLink);
    }

    // 4a. GitHub-style pinned Hero + Tech Stack card overlay + logo parallax
    initTechStackParallax() {
        const bridge = document.querySelector('[data-scroll-bridge]');
        const hero = document.querySelector('[data-hero-section]');
        const card = document.querySelector('[data-tech-card]');
        if (!bridge || !hero || !card) return;

        const panel = card.querySelector('[data-parallax-panel]');
        const logos = card.querySelectorAll('.tech-stack-logo');
        if (!panel || logos.length === 0) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const COVER_PHASE = 0.45;

        if (this._techStackScrollHandler) {
            window.removeEventListener('scroll', this._techStackScrollHandler);
            window.removeEventListener('resize', this._techStackScrollHandler);
        }

        const getBridgeProgress = () => {
            const viewportHeight = window.innerHeight;
            const scrollRange = Math.max(bridge.offsetHeight - viewportHeight, 1);
            const scrolled = window.scrollY - bridge.offsetTop;
            return Math.min(Math.max(scrolled / scrollRange, 0), 1);
        };

        const applyPinnedState = (bridgeProgress, coverProgress, parallaxPhase) => {
            bridge.style.setProperty('--cover-progress', coverProgress.toFixed(4));
            bridge.style.setProperty('--stack-parallax', parallaxPhase.toFixed(4));
            hero.style.setProperty('--hero-recede', coverProgress.toFixed(4));

            if (coverProgress >= 0.98) {
                hero.classList.add('is-covered');
            } else {
                hero.classList.remove('is-covered');
            }
        };

        if (prefersReducedMotion) {
            applyPinnedState(1, 1, 0);
            return;
        }

        let ticking = false;

        const update = () => {
            const bridgeProgress = getBridgeProgress();
            const coverRaw = Math.min(bridgeProgress / COVER_PHASE, 1);
            const coverProgress = coverRaw;
            const parallaxPhase = coverProgress >= 1
                ? (bridgeProgress - COVER_PHASE) / (1 - COVER_PHASE)
                : coverProgress * 0.25;

            applyPinnedState(bridgeProgress, coverProgress, parallaxPhase);

            const intensity = window.innerWidth <= 768 ? 0.4 : 1;
            const centered = parallaxPhase - 0.5;
            const parallaxStrength = intensity * Math.min(coverProgress + 0.15, 1);

            const panelY = centered * 22 * parallaxStrength;
            panel.style.transform = `translate3d(0, ${panelY}px, 0)`;

            logos.forEach((logo) => {
                logo.style.transform = 'none';
            });

            ticking = false;
        };

        this._techStackScrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        };

        this._getBridgeProgress = getBridgeProgress;

        window.addEventListener('scroll', this._techStackScrollHandler, { passive: true });
        window.addEventListener('resize', this._techStackScrollHandler, { passive: true });
        update();
    }

    // 4b. Smooth Image scroll parallax
    initScrollParallax() {
        const heroBg = document.querySelector('.home__hero-bg-main-inner-man img');
        const introPortrait = document.querySelector('.home__intro-portrait img');
        const aboutPortrait = document.querySelector('.about-intro-media img');

        const handleScroll = () => {
            const scrollY = window.scrollY;

            // Hero Portrait parallax (disabled while pinned bridge is active)
            if (heroBg) {
                const bridge = document.querySelector('[data-scroll-bridge]');
                const inPinnedBridge = bridge && scrollY >= bridge.offsetTop
                    && scrollY <= bridge.offsetTop + bridge.offsetHeight - window.innerHeight;

                if (inPinnedBridge && this._getBridgeProgress) {
                    heroBg.style.transform = 'scale(1.05)';
                } else {
                    heroBg.style.transform = `translateY(${scrollY * 0.12}px) scale(1.05)`;
                }
            }

            // Intro Portrait parallax
            if (introPortrait) {
                const rect = introPortrait.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const relativeScroll = window.innerHeight - rect.top;
                    introPortrait.style.transform = `translateY(${relativeScroll * 0.06}px) scale(1.1)`;
                }
            }

            // About Bio Portrait parallax
            if (aboutPortrait) {
                const rect = aboutPortrait.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const relativeScroll = window.innerHeight - rect.top;
                    aboutPortrait.style.transform = `translateY(${relativeScroll * 0.06}px) scale(1.05)`;
                }
            }
        };

        window.removeEventListener('scroll', handleScroll);
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Trigger once initially
    }

    // 5. Mobile Navigation Menu Overlay
    initMobileMenu() {
        const menuToggle = document.querySelector('.header__toggle');
        const navOverlay = document.querySelector('.mobile-nav-overlay');
        if (!menuToggle || !navOverlay) return;

        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            navOverlay.classList.toggle('active');

            const openSpan = menuToggle.querySelector('.header__toggle-open');
            const closeSpan = menuToggle.querySelector('.header__toggle-close');

            if (menuToggle.classList.contains('open')) {
                if (openSpan) openSpan.style.display = 'none';
                if (closeSpan) closeSpan.style.display = 'inline';
            } else {
                if (openSpan) openSpan.style.display = 'inline';
                if (closeSpan) closeSpan.style.display = 'none';
            }
        });
    }

    // 6. Header Scrolled Accent State
    initHeaderScroll() {
        const header = document.getElementById('header');
        if (!header) return;

        const checkScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', checkScroll);
        checkScroll();
    }

    // 7. Interactive Magnetic Elements
    initMagneticEffects() {
        const magneticElements = document.querySelectorAll('[data-cursor-stick]');

        magneticElements.forEach(elem => {
            elem.addEventListener('mousemove', (e) => {
                const rect = elem.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Push the button towards the mouse slightly
                elem.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            elem.addEventListener('mouseleave', () => {
                elem.style.transform = 'translate(0, 0)';
            });
        });
    }

    // 8. Contact Form Sleek Terminal feedback
    initContactForm() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('.form-btn');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'TRANSMITTING DETAILS...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.textContent = 'DETAILS SECURED!';
                submitBtn.style.backgroundColor = '#4CAF50';
                submitBtn.style.boxShadow = '0 5px 15px rgba(76, 175, 80, 0.3)';

                // Form Reset
                setTimeout(() => {
                    form.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.boxShadow = '';
                }, 3000);
            }, 1500);
        });
    }

    // 9. Scroll-Triggered Philosophy Typing Animation
    initPhilosophyTyping() {
        const container = document.getElementById('philosophy-typing');
        if (!container) return;

        // Respect reduced-motion: show everything instantly
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            const label = container.querySelector('.philosophy-label');
            if (label) label.classList.add('is-visible');
            container.querySelectorAll('.philosophy-paragraph').forEach(p => {
                p.classList.add('is-complete');
            });
            return;
        }

        // Prevent replaying if already animated
        if (container.dataset.philosophyAnimated === 'true') return;

        const label = container.querySelector('.philosophy-label');
        const paragraphs = Array.from(container.querySelectorAll('.philosophy-paragraph'));
        if (paragraphs.length === 0) return;

        // Store original HTML with highlights and prepare DOM for typing
        const paragraphData = paragraphs.map(p => {
            // Store the original HTML to restore after typing
            const originalHTML = p.innerHTML;
            const fullText = p.textContent;
            p.innerHTML = ''; // Clear for typing
            const output = document.createElement('span');
            output.className = 'typing-output';
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            cursor.setAttribute('aria-hidden', 'true');
            p.appendChild(output);
            p.appendChild(cursor);
            return { element: p, output, cursor, fullText, originalHTML, charIndex: 0, complete: false };
        });

        // Natural typing speed: variable delays based on punctuation
        const getCharDelay = (char) => {
            if (char === '.') return 180;
            if (char === ',') return 90;
            if (char === ';' || char === ':') return 60;
            if (char === ' ') return 20;
            return 28; // Base typing speed
        };

        // Overlap threshold: start next paragraph when previous is this % complete
        const OVERLAP_THRESHOLD = 0.80;

        let currentParagraphIndex = 0;
        let lastTimestamp = 0;
        let nextCharTime = 0;
        let animationRunning = false;

        const typeFrame = (timestamp) => {
            if (!animationRunning) return;

            if (lastTimestamp === 0) lastTimestamp = timestamp;

            // Process all active paragraphs (current + any started via overlap)
            let allComplete = true;

            for (let i = 0; i <= currentParagraphIndex && i < paragraphData.length; i++) {
                const data = paragraphData[i];
                if (data.complete) continue;
                allComplete = false;

                // Start typing: add is-typing class on first char
                if (data.charIndex === 0 && !data.element.classList.contains('is-typing')) {
                    data.element.classList.add('is-typing');
                    // Stagger initial delay for secondary paragraphs
                    if (i > 0) {
                        data._startDelay = timestamp + 200;
                    }
                }

                // Wait for stagger delay
                if (data._startDelay && timestamp < data._startDelay) continue;

                // Character-by-character typing with timing
                if (!data._nextCharTime) data._nextCharTime = timestamp;

                if (timestamp >= data._nextCharTime && data.charIndex < data.fullText.length) {
                    const char = data.fullText[data.charIndex];
                    data.output.textContent += char;
                    data.charIndex++;
                    data._nextCharTime = timestamp + getCharDelay(char);

                    // Check if we should start the next paragraph (overlap)
                    const progress = data.charIndex / data.fullText.length;
                    if (progress >= OVERLAP_THRESHOLD && currentParagraphIndex === i && currentParagraphIndex < paragraphData.length - 1) {
                        currentParagraphIndex++;
                    }
                }

                // Check completion
                if (data.charIndex >= data.fullText.length) {
                    data.complete = true;
                    data.element.classList.remove('is-typing');
                    data.element.classList.add('is-complete');
                    // Restore original HTML with highlights after typing completes
                    if (data.originalHTML) {
                        data.output.remove();
                        data.cursor.remove();
                        data.element.innerHTML = data.originalHTML;
                    }
                }
            }

            if (!allComplete || currentParagraphIndex < paragraphData.length - 1) {
                requestAnimationFrame(typeFrame);
            } else {
                // Final: mark container as animated so it doesn't replay
                container.dataset.philosophyAnimated = 'true';
                animationRunning = false;
            }
        };

        // IntersectionObserver to trigger animation on scroll into view
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animationRunning && container.dataset.philosophyAnimated !== 'true') {
                    animationRunning = true;

                    // Reveal the label first with a slight lead
                    if (label) {
                        label.classList.add('is-visible');
                    }

                    // Start typing after label reveals
                    setTimeout(() => {
                        requestAnimationFrame(typeFrame);
                    }, 500);

                    obs.unobserve(container);
                }
            });
        }, {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -5% 0px'
        });

        observer.observe(container);
    }

    // 10. Scroll-Driven Project Showcase
    initProjectShowcase() {
        const wrapper = document.querySelector('[data-project-showcase]');
        if (!wrapper) return;

        const stage = wrapper.querySelector('.project-showcase__stage');
        const cards = Array.from(wrapper.querySelectorAll('[data-project-card]'));
        const dots = Array.from(wrapper.querySelectorAll('.project-showcase__dot'));
        const counterCurrent = wrapper.querySelector('.project-showcase__counter-current');
        const scrollHint = wrapper.querySelector('.project-showcase__scroll-hint');
        const projectCount = cards.length;

        if (projectCount === 0) return;

        // Cleanup previous listeners if re-initializing
        if (this._showcaseScrollHandler) {
            window.removeEventListener('scroll', this._showcaseScrollHandler);
        }

        let currentIndex = -1; // Force first update
        let ticking = false;

        /**
         * Map global scroll position to a project index (0 … N-1).
         * The wrapper is (N+1) * 100vh tall. The first 100vh is the
         * "entry" zone (shows first project). Each subsequent 100vh
         * transitions to the next project.
         */
        const getActiveIndex = () => {
            const wrapperTop = wrapper.offsetTop;
            const wrapperHeight = wrapper.offsetHeight;
            const viewportH = window.innerHeight;
            const scrollRange = Math.max(wrapperHeight - viewportH, 1);
            const scrolled = window.scrollY - wrapperTop;
            const progress = Math.min(Math.max(scrolled / scrollRange, 0), 1);

            // Distribute progress evenly across projects
            const raw = progress * projectCount;
            return Math.min(Math.floor(raw), projectCount - 1);
        };

        /**
         * Apply card states and update navigation UI
         */
        const applyState = (newIndex) => {
            if (newIndex === currentIndex) return;
            currentIndex = newIndex;

            // Update card data-state attributes
            cards.forEach((card, i) => {
                if (i === currentIndex) {
                    card.setAttribute('data-state', 'active');
                } else if (i < currentIndex) {
                    card.setAttribute('data-state', 'exiting');
                } else {
                    card.setAttribute('data-state', 'upcoming');
                }
            });

            // Update progress dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });

            // Update counter
            if (counterCurrent) {
                counterCurrent.textContent = String(currentIndex + 1).padStart(2, '0');
            }

            // Hide scroll hint after first transition
            if (scrollHint && currentIndex > 0) {
                scrollHint.style.opacity = '0';
                scrollHint.style.pointerEvents = 'none';
            } else if (scrollHint && currentIndex === 0) {
                scrollHint.style.opacity = '';
                scrollHint.style.pointerEvents = '';
            }
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const idx = getActiveIndex();
                    applyState(idx);
                    ticking = false;
                });
                ticking = true;
            }
        };

        this._showcaseScrollHandler = onScroll;
        window.addEventListener('scroll', onScroll, { passive: true });

        // Dot click navigation — scroll to the correct wrapper position
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                const wrapperTop = wrapper.offsetTop;
                const wrapperHeight = wrapper.offsetHeight;
                const viewportH = window.innerHeight;
                const scrollRange = wrapperHeight - viewportH;

                // Target progress for project i (center of its segment)
                const targetProgress = (i + 0.5) / projectCount;
                const targetScroll = wrapperTop + targetProgress * scrollRange;

                window.scrollTo({
                    top: targetScroll,
                    behavior: 'smooth'
                });
            });
        });

        // Initial state
        applyState(getActiveIndex());
    }

    // Re-initialize all scripts after an AJAX Page swap
    reinitialize() {
        this.initCursor();
        this.initTimeGreeting();
        this.initTechStackParallax();
        this.initScrollObservers();
        this.initMobileMenu();
        this.initHeaderScroll();
        this.initMagneticEffects();
        this.initContactForm();
        this.initPhilosophyTyping();
        this.initProjectShowcase();
        this.initNavHighlightOnScroll();
    }
}

// Boot up Portfolio Engine on DOM load
window.addEventListener('DOMContentLoaded', () => {
    window.portfolioController = new PortfolioController();
});
