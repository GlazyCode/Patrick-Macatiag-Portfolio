/* ----------------------------------------------------------------
   GlazyCode Portfolio - AJAX Transition Router (Valentin Cheval Theme)
   ---------------------------------------------------------------- */

class PageRouter {
    constructor() {
        this.isTransitioning = false;
        this.createOverlayElements();
        this.initEventListeners();
    }

    createOverlayElements() {
        // Create transition overlay elements and append to body
        const overlay = document.createElement('div');
        overlay.className = 'page-wipe-overlay';
        overlay.innerHTML = `
            <div class="wipe-panel-orange"></div>
            <div class="wipe-panel-black">
                <div class="wipe-text">Loading...</div>
            </div>
        `;
        document.body.appendChild(overlay);

        this.orangePanel = overlay.querySelector('.wipe-panel-orange');
        this.blackPanel = overlay.querySelector('.wipe-panel-black');
        this.wipeText = overlay.querySelector('.wipe-text');
    }

    initEventListeners() {
        // Intercept all clicks on local links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href) return;

            // Check if link is local, not a hash/anchor, not an external site, and not opening in new tab
            const isLocal = href.startsWith('/') || href.includes(window.location.hostname) || !href.includes('://');
            const isAnchor = href.startsWith('#');
            const isTargetBlank = link.getAttribute('target') === '_blank';
            const isMailTo = href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('wa.me');

            if (isLocal && !isAnchor && !isTargetBlank && !isMailTo && !this.isTransitioning) {
                e.preventDefault();
                this.navigateTo(href);
            }
        });

        // Handle browser Back/Forward buttons
        window.addEventListener('popstate', () => {
            this.loadPage(window.location.pathname + window.location.search, false);
        });
    }

    async navigateTo(url) {
        this.isTransitioning = true;
        
        // Determine page title name to show on transition wipe
        let pageName = 'LOADING...';
        if (url.includes('about')) pageName = 'GlazyCode / About';
        else if (url.includes('projects')) pageName = 'GlazyCode / Projects';
        else if (url.includes('contact')) pageName = 'GlazyCode / Contact';
        else pageName = 'GlazyCode / Home';

        this.wipeText.textContent = pageName.toUpperCase();

        // 1. Play Slide-in wipe animation
        this.orangePanel.classList.remove('wipe-out');
        this.blackPanel.classList.remove('wipe-out');
        this.wipeText.classList.remove('fade-up');

        this.orangePanel.classList.add('wipe-in');
        this.blackPanel.classList.add('wipe-in');
        
        // Show text after overlay settles
        setTimeout(() => {
            this.wipeText.classList.add('fade-up');
        }, 300);

        // 2. Fetch new page HTML after wipe covers the screen
        setTimeout(async () => {
            try {
                await this.loadPage(url, true);
            } catch (err) {
                console.error('Failed to load page:', err);
                window.location.href = url; // Fallback to standard redirect if fetch fails
            }
        }, 800);
    }

    async loadPage(url, pushState = true) {
        // Fetch new content
        const response = await fetch(url);
        const html = await response.text();

        // Parse fetched HTML
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(html, 'text/html');

        // Update Title & Meta Tags
        document.title = newDoc.title;

        // Replace `<main>` content
        const currentMain = document.querySelector('main');
        const newMain = newDoc.querySelector('main');
        
        if (currentMain && newMain) {
            // Smoothly swap classes/contents
            currentMain.innerHTML = newMain.innerHTML;
            currentMain.className = newMain.className;
            currentMain.setAttribute('data-namespace', newMain.getAttribute('data-namespace') || '');
        }

        // Update URL history if navigating forward
        if (pushState) {
            window.history.pushState(null, null, url);
        }

        // Update active navigation class in Header and Mobile Navigation Overlay
        this.updateActiveNavLinks(url);

        // Scroll to top
        window.scrollTo(0, 0);

        // Re-initialize page specific JavaScript controls (scroll reveal, greetings, cursor sticks, etc.)
        if (window.portfolioController) {
            window.portfolioController.reinitialize();
        }

        // Close mobile overlay menu if open
        const mobileNav = document.querySelector('.mobile-nav-overlay');
        if (mobileNav) mobileNav.classList.remove('active');
        const menuBtn = document.querySelector('.header__toggle');
        if (menuBtn) {
            menuBtn.classList.remove('open');
            const openSpan = menuBtn.querySelector('.header__toggle-open');
            const closeSpan = menuBtn.querySelector('.header__toggle-close');
            if (openSpan) openSpan.style.display = 'inline';
            if (closeSpan) closeSpan.style.display = 'none';
        }

        // 3. Play Slide-out wipe animation to reveal content
        setTimeout(() => {
            this.orangePanel.classList.remove('wipe-in');
            this.blackPanel.classList.remove('wipe-in');
            this.wipeText.classList.remove('fade-up');

            this.orangePanel.classList.add('wipe-out');
            this.blackPanel.classList.add('wipe-out');

            // Reset transition locks
            setTimeout(() => {
                this.isTransitioning = false;
            }, 800);
        }, 500);
    }

    updateActiveNavLinks(url) {
        const links = document.querySelectorAll('.header__menu-link, .mobile-nav-link');
        const cleanUrl = url.split('/').pop() || 'index.html';

        links.forEach(link => {
            const href = link.getAttribute('href');
            const cleanHref = href.split('/').pop() || 'index.html';

            if (cleanHref === cleanUrl || (cleanUrl === 'index.html' && cleanHref === '/') || (cleanUrl === '/' && cleanHref === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// Instantiate Router when page loads
window.addEventListener('DOMContentLoaded', () => {
    window.pageRouter = new PageRouter();
});
