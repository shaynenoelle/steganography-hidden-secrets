/**
 * Performance Optimization Script
 * Debounces scroll handlers and optimizes animations
 */

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle utility for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Detect low-end devices
function isLowEndDevice() {
    const hardwareConcurrency = navigator.hardwareConcurrency || 2;
    const deviceMemory = navigator.deviceMemory || 2;
    
    return hardwareConcurrency <= 2 || deviceMemory <= 2;
}

// Apply performance mode
if (isLowEndDevice()) {
    document.documentElement.classList.add('reduce-motion');
    console.log('🔧 Performance mode enabled for low-end device');
}

// Lazy-load sections - Only animate when visible
class LazyAnimationLoader {
    constructor() {
        this.sections = document.querySelectorAll(
            '.learn-section, .help-section, .developers-section, .about-section, .video-demo-section'
        );
        this.loadedSections = new Set();
        this.init();
    }

    init() {
        const observerOptions = {
            root: null,
            rootMargin: '100px', // Start loading 100px before entering viewport
            threshold: 0.01
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.loadedSections.has(entry.target)) {
                    this.loadSection(entry.target);
                    this.loadedSections.add(entry.target);
                    // Stop observing once loaded
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.sections.forEach(section => {
            // Mark as not loaded initially
            section.classList.add('lazy-section');
            observer.observe(section);
        });
    }

    loadSection(section) {
        // Add loaded class to trigger animations
        section.classList.add('section-loaded');
        
        // Activate scroll animations for elements inside
        const animElements = section.querySelectorAll('[data-scroll]');
        animElements.forEach(el => {
            el.classList.add('lazy-ready');
        });

        console.log('✅ Section loaded:', section.className);
    }
}

// Optimize scroll handlers with throttling
class OptimizedScrollManager {
    constructor() {
        this.scrollY = window.scrollY;
        this.ticking = false;
        
        // Throttle scroll updates to 60fps max (16ms)
        this.handleScroll = throttle(() => {
            this.scrollY = window.scrollY;
            this.update();
        }, 16);

        window.addEventListener('scroll', this.handleScroll, { passive: true });
    }

    update() {
        // Update scroll progress
        this.updateScrollProgress();
        
        // Update back to top button
        this.updateBackToTop();
    }

    updateScrollProgress() {
        const scrollProgress = document.getElementById('scrollProgress');
        if (!scrollProgress) return;

        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        
        scrollProgress.style.width = progress + '%';
    }

    updateBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;

        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
}

// Disable animations on low-end devices
function disableHeavyAnimations() {
    if (!isLowEndDevice()) return;

    // Disable particles
    const particles = document.getElementById('particles');
    if (particles) particles.style.display = 'none';

    // Disable circuit flows
    document.querySelectorAll('.circuit-flow').forEach(el => {
        el.style.display = 'none';
    });

    // Simplify card hover effects
    const style = document.createElement('style');
    style.textContent = `
        .reduce-motion .info-item:hover,
        .reduce-motion .faq-item:hover,
        .reduce-motion .dev-card:hover,
        .reduce-motion .about-card:hover {
            transform: translateY(-4px) !important;
            transition: transform 0.2s ease !important;
        }
    `;
    document.head.appendChild(style);

    console.log('🎯 Heavy animations disabled');
}

// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause all animations
        document.body.style.animationPlayState = 'paused';
        document.querySelectorAll('*').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations
        document.body.style.animationPlayState = 'running';
        document.querySelectorAll('*').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

// Initialize optimizations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerformanceOptimizations);
} else {
    initPerformanceOptimizations();
}

function initPerformanceOptimizations() {
    console.log('🚀 Initializing performance optimizations...');
    
    // Detect and apply performance mode
    disableHeavyAnimations();
    
    // Initialize lazy loading
    new LazyAnimationLoader();
    
    // Initialize optimized scroll manager
    new OptimizedScrollManager();
    
    console.log('✅ Performance optimizations complete');
}

// Export for use in other scripts
window.PerformanceUtils = {
    debounce,
    throttle,
    isLowEndDevice
};