/**
 * Reusable Header Component
 * Injects the header HTML into all pages
 * FIXED: Navigation for GitHub Pages deployment
 */

(function() {
    const headerHTML = `
    <header class="top-header">
        <div class="header-content">
            <a href="index.html" class="logo-section no-loading" style="text-decoration: none; cursor: pointer;">
                <span class="lock-icon"><i class="fas fa-lock"></i></span>
                <h1 class="logo-title">Hidden Secrets</h1>
            </a>
            <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Toggle navigation menu">
                <i class="fas fa-bars"></i>
            </button>
            <nav class="utility-nav" id="utilityNav">
                <div class="nav-primary">
                    <a href="index.html#embed" class="nav-link no-reload" data-page="steganography" data-section="embed"> &lt;/ TOOL&gt;</a>
                    <a href="index.html#learn" class="nav-link no-reload" data-page="steganography" data-section="learn"> &lt;/ LEARN&gt; </a>
                </div>
                <div class="nav-secondary">
                    <a href="help.html" class="nav-link no-reload" data-page="help"> &lt;/ HELP&gt;</a>
                    <a href="about.html" class="nav-link no-reload" data-page="about"> &lt;/ ABOUT&gt;</a>
                </div>
                <button class="theme-toggle" id="themeToggle" title="Toggle Theme (Alt+T)" aria-label="Toggle dark/light theme">
                    <span class="theme-icon"><i class="fas fa-moon"></i></span>
                </button>
            </nav>
        </div>
    </header>
    `;

    // Function to inject header
    function injectHeader() {
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            headerPlaceholder.innerHTML = headerHTML;
            headerPlaceholder.classList.add('loaded');
            highlightActivePage();
            initMobileMenu();
            initThemeToggle();
            initNavigationLinks();
            initLogoClick();
        }
    }

    // Handle logo clicks - always show loading screen
    function initLogoClick() {
        const logo = document.querySelector('.logo-section.no-loading');
        if (logo) {
            logo.addEventListener('click', (e) => {
                e.preventDefault();
                // Show loading screen before navigation
                showLoadingScreen();
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 100);
            });
        }
    }

    // Show loading screen helper
    function showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    }

    // Initialize navigation links with cross-page handling - FIXED VERSION
    function initNavigationLinks() {
        const navLinks = document.querySelectorAll('.nav-link.no-reload');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetPage = link.getAttribute('data-page');
                const currentPage = getCurrentPage();
                const targetHref = link.getAttribute('href');
                
                // TOOL and LEARN links (index.html with hash)
                if (targetPage === 'steganography') {
                    e.preventDefault(); // Always prevent default for steganography links
                    
                    // Extract hash from href
                    const hash = targetHref.includes('#') ? targetHref.split('#')[1] : '';
                    
                    // If we're already on index.html
                    if (currentPage === 'steganography') {
                        if (hash) {
                            // Update URL hash without reload
                            history.pushState(null, null, `#${hash}`);
                            
                            // Smooth scroll to section
                            const targetSection = document.getElementById(hash);
                            if (targetSection) {
                                const headerOffset = 80;
                                const elementPosition = targetSection.getBoundingClientRect().top + window.scrollY;
                                const offsetPosition = elementPosition - headerOffset;

                                window.scrollTo({
                                    top: offsetPosition,
                                    behavior: 'smooth'
                                });
                            }
                            
                            // Update active link highlighting
                            highlightActivePage();
                        }
                    } 
                    // If we're on a different page (help.html or about.html)
                    else {
                        // Show loading screen
                        showLoadingScreen();
                        
                        // Navigate to index.html with hash
                        setTimeout(() => {
                            // Use full href to ensure proper navigation
                            window.location.href = targetHref;
                        }, 100);
                    }
                }
                // HELP and ABOUT links (different HTML files)
                else if (targetPage !== currentPage) {
                    // Only prevent default if on steganography page
                    // This allows normal navigation from help/about to help/about
                    if (currentPage === 'steganography') {
                        e.preventDefault();
                        showLoadingScreen();
                        setTimeout(() => {
                            window.location.href = targetHref;
                        }, 100);
                    }
                    // Otherwise, let browser handle normal navigation
                }
            });
        });
    }

    // Initialize theme toggle functionality
    function initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle?.querySelector('.theme-icon i');

        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        if (themeIcon) {
            themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }

        themeToggle?.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            if (themeIcon) {
                themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
            }
            
            if (typeof showNotification === 'function') {
                showNotification(`Switched to ${newTheme} mode`, 'info');
            }
        });
    }

    // Highlight the active page in navigation
    function highlightActivePage() {
        const currentPage = getCurrentPage();
        const currentHash = window.location.hash.replace('#', '');
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const linkPage = link.getAttribute('data-page');
            const linkSection = link.getAttribute('data-section');
            
            if (currentPage === 'steganography' && linkPage === 'steganography') {
                if (linkSection) {
                    if (linkSection === currentHash || 
                        (linkSection === 'embed' && (!currentHash || currentHash === 'hero'))) {
                        link.classList.add('active');
                    }
                }
            }
            else if (linkPage === currentPage && currentPage !== 'steganography') {
                link.classList.add('active');
            }
        });
    }

    // Get current page name from URL - IMPROVED VERSION
    function getCurrentPage() {
        const path = window.location.pathname;
        // Handle both local (file.html) and deployed (folder/file.html) paths
        const page = path.split('/').pop().replace('.html', '') || 'steganography';
        
        if (page === '' || page === 'index') {
            return 'steganography';
        }
        
        return page;
    }

    // Mobile menu functionality
    function initMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const utilityNav = document.getElementById('utilityNav');

        if (mobileMenuToggle && utilityNav) {
            const newToggle = mobileMenuToggle.cloneNode(true);
            mobileMenuToggle.parentNode.replaceChild(newToggle, mobileMenuToggle);

            newToggle.setAttribute('aria-controls', 'utilityNav');
            newToggle.setAttribute('aria-expanded', 'false');

            function openMenu() {
                utilityNav.style.display = 'flex';
                utilityNav.style.visibility = 'visible';
                requestAnimationFrame(() => utilityNav.classList.add('active'));
                newToggle.setAttribute('aria-expanded', 'true');
                
                if (window.innerWidth <= 768) {
                    document.body.style.overflow = 'hidden';
                }
                
                const icon = newToggle.querySelector('i');
                if (icon) { 
                    icon.classList.remove('fa-bars'); 
                    icon.classList.add('fa-times'); 
                }
            }

            function closeMenu() {
                utilityNav.classList.remove('active');
                newToggle.setAttribute('aria-expanded', 'false');
                
                setTimeout(() => { document.body.style.overflow = ''; }, 220);
                
                setTimeout(() => {
                    if (!utilityNav.classList.contains('active')) {
                        utilityNav.style.display = '';
                        utilityNav.style.visibility = '';
                    }
                }, 260);
                
                const icon = newToggle.querySelector('i');
                if (icon) { 
                    icon.classList.remove('fa-times'); 
                    icon.classList.add('fa-bars'); 
                }
            }

            newToggle.addEventListener('click', function(e) {
                if (utilityNav.classList.contains('active')) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });

            document.addEventListener('keydown', function(ev) {
                if (ev.key === 'Escape' && utilityNav.classList.contains('active')) {
                    closeMenu();
                }
            });

            document.addEventListener('click', function(ev) {
                if (!utilityNav.contains(ev.target) && 
                    !newToggle.contains(ev.target) && 
                    utilityNav.classList.contains('active')) {
                    closeMenu();
                }
            });

            const navLinks = utilityNav.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    closeMenu();
                });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectHeader);
    } else {
        injectHeader();
    }
    
    window.addEventListener('hashchange', () => {
        highlightActivePage();
    });
})();
