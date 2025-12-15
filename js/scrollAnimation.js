/**
 * Advanced Scroll Animation System
 * Creates smooth, interactive animations triggered by scroll position
 */

class AdvancedScrollAnimator {
    constructor() {
        this.scrollY = 0;
        this.windowHeight = window.innerHeight;
        this.elements = [];
        this.parallaxElements = [];
        this.videoSteps = [];
        this.animationFrameId = null;
        this.lastScrollY = 0;
        this.scrollDirection = 'down';
        this.scrollVelocity = 0;
        
        this.init();
    }

    init() {
        this.collectElements();
        this.setupEventListeners();
        this.startAnimationLoop();
        this.triggerInitialAnimations();
    }

    collectElements() {
        // Collect scroll-triggered elements
        document.querySelectorAll('[data-scroll]').forEach(el => {
            this.elements.push({
                element: el,
                type: el.dataset.scroll,
                delay: parseInt(el.dataset.delay) || 0,
                duration: parseInt(el.dataset.duration) || 800,
                triggered: false,
                triggerPoint: 0,
                progress: 0
            });
        });

        // Collect parallax elements
        document.querySelectorAll('[data-parallax]').forEach(el => {
            this.parallaxElements.push({
                element: el,
                speed: parseFloat(el.dataset.parallax),
                offset: 0
            });
        });

        // Collect video steps
        document.querySelectorAll('[data-step]').forEach(el => {
            this.videoSteps.push({
                element: el,
                step: parseInt(el.dataset.step),
                threshold: (el.dataset.step - 1) * 0.25 // 0, 0.25, 0.5, 0.75
            });
        });
    }

    setupEventListeners() {
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        window.addEventListener('resize', () => this.handleResize(), { passive: true });
        document.addEventListener('DOMContentLoaded', () => this.triggerInitialAnimations());
    }

    handleScroll() {
        this.scrollY = window.scrollY;
        this.scrollVelocity = Math.abs(this.scrollY - this.lastScrollY);
        this.scrollDirection = this.scrollY > this.lastScrollY ? 'down' : 'up';
        this.lastScrollY = this.scrollY;
    }

    handleResize() {
        this.windowHeight = window.innerHeight;
    }

    startAnimationLoop() {
        let lastTime = 0;
        const fps = 30; // Reduce from 60fps to 30fps
        const interval = 1000 / fps;
        
        const animate = (currentTime) => {
            this.animationFrameId = requestAnimationFrame(animate);
            
            const deltaTime = currentTime - lastTime;
            
            if (deltaTime < interval) {
                return; // Skip this frame
            }
            
            lastTime = currentTime - (deltaTime % interval);
            
            // Only update what's necessary
            this.updateAnimations();
            
            // Update these less frequently
            if (Math.random() > 0.5) { // 50% of frames
                this.updateParallax();
                this.updateVideoDemo();
            }
        };
        animate(0);
    }

    triggerInitialAnimations() {
        // Trigger animations for elements already in view
        setTimeout(() => {
            this.elements.forEach(item => {
                const rect = item.element.getBoundingClientRect();
                if (rect.top < this.windowHeight * 0.8) {
                    this.triggerAnimation(item);
                }
            });
        }, 100);
    }

    updateAnimations() {
        this.elements.forEach(item => {
            const rect = item.element.getBoundingClientRect();
            const elementCenter = rect.top + rect.height / 2;
            const distanceFromCenter = Math.abs(elementCenter - this.windowHeight / 2);
            const maxDistance = this.windowHeight + rect.height;
            
            // Calculate progress (0 to 1)
            item.progress = Math.max(0, Math.min(1, 1 - distanceFromCenter / maxDistance));

            // Check if element should trigger
            if (!item.triggered && rect.top < this.windowHeight * 0.8 && rect.bottom > 0) {
                setTimeout(() => {
                    this.triggerAnimation(item);
                }, item.delay);
            }

            // Update continuous animations
            if (item.triggered) {
                this.applyAnimationProgress(item);
            }
        });
    }

    triggerAnimation(item) {
        if (item.triggered) return;
        item.triggered = true;

        const animationClasses = {
            'fade-up': 'animate-fade-up',
            'fade-in': 'animate-fade-in',
            'slide-left': 'animate-slide-left',
            'slide-right': 'animate-slide-right',
            'scale': 'animate-scale',
            'rotate': 'animate-rotate',
            'bounce': 'animate-bounce-in',
            'flip': 'animate-flip'
        };

        const classToAdd = animationClasses[item.type] || 'animate-fade-up';
        item.element.classList.add(classToAdd);
        item.element.classList.add('view-animated');
    }

    applyAnimationProgress(item) {
        // Only apply subtle effects after animation has triggered
        // Don't override the CSS animation transforms
        if (item.element.classList.contains('view-animated')) {
            return; // Let CSS handle the animation
        }
    }

    updateParallax() {
        this.parallaxElements.forEach(item => {
            const rect = item.element.getBoundingClientRect();
            const elementProgress = 1 - (rect.top / this.windowHeight);
            const offset = elementProgress * 100 * item.speed;
            
            item.element.style.transform = `translateY(${offset}px)`;
        });
    }

    updateVideoDemo() {
        const videoSection = document.querySelector('.video-demo-section');
        if (!videoSection) return;

        const rect = videoSection.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        
        // Calculate scroll progress through this section
        const scrollProgress = Math.max(0, Math.min(1,
            (this.windowHeight - sectionTop) / (this.windowHeight + sectionHeight)
        ));

        // Update progress bar with smooth easing
        const progressBar = document.querySelector('.video-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${scrollProgress * 100}%`;
        }

        // Update frame glow with smooth intensity
        const videoFrame = document.querySelector('.demo-video-frame');
        if (videoFrame) {
            const glowIntensity = 0.2 + (scrollProgress * 0.8);
            const glowSize = 20 + (scrollProgress * 40);
            videoFrame.style.boxShadow = `0 0 ${glowSize}px rgba(0, 217, 255, ${glowIntensity})`;
        }
    }

    updateElementStates() {
        // Add interactive effects to cards and buttons
        const interactiveElements = document.querySelectorAll('.info-item, .faq-item, .dev-card, .about-card');
        
        interactiveElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isInView = rect.top < this.windowHeight * 0.8 && rect.bottom > 0;
            
            if (isInView && !el.classList.contains('view-animated')) {
                el.classList.add('view-animated');
                el.style.opacity = '1';
            }
        });
    }

    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
}

/**
 * Smooth Scroll Enhancement
 */
class SmoothScrollEnhancer {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleSmoothScroll(e));
        });
    }

    handleSmoothScroll(e) {
        const href = e.currentTarget.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Interactive Card Effects with 3D Tilt
 */
class CardInteractionManager {
    constructor() {
        this.init();
    }

    init() {
        const cards = document.querySelectorAll('.info-item, .faq-item, .dev-card, .about-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => this.handleCardEnter(e));
            card.addEventListener('mouseleave', (e) => this.handleCardLeave(e));
            card.addEventListener('mousemove', (e) => this.handleCardMouseMove(e));
        });
    }

    handleCardEnter(e) {
        const card = e.currentTarget;
        card.style.transition = 'none'; // Remove transition for smooth tracking
    }

    handleCardLeave(e) {
        const card = e.currentTarget;
        card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        card.style.boxShadow = '';
    }

    handleCardMouseMove(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate rotation based on mouse position
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        // Calculate glow position
        const glowX = (x / rect.width) * 100;
        const glowY = (y / rect.height) * 100;

        card.style.transform = `
            perspective(1000px) 
            rotateX(${-rotateX}deg) 
            rotateY(${-rotateY}deg) 
            translateY(-8px)
            scale(1.02)
        `;

        card.style.boxShadow = `
            0 20px 40px rgba(0, 217, 255, 0.2),
            inset 0 0 60px rgba(0, 217, 255, 0.05)
        `;

        // Add dynamic highlight
        card.style.background = `
            radial-gradient(
                circle at ${glowX}% ${glowY}%, 
                rgba(0, 217, 255, 0.15) 0%, 
                transparent 50%
            ),
            var(--surface-elevated)
        `;
    }
}

/**
 * Button Ripple Effect with Enhanced Animation
 */
class RippleEffectManager {
    constructor() {
        this.init();
    }

    init() {
        const buttons = document.querySelectorAll('.btn, .tab-btn, .social-link, .nav-link');

        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => this.createRipple(e));
        });
    }

    createRipple(e) {
        const btn = e.currentTarget;

        // Remove any existing ripples
        const existingRipples = btn.querySelectorAll('.ripple');
        existingRipples.forEach(r => r.remove());

        const ripple = document.createElement('span');
        ripple.className = 'ripple';

        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 40%, transparent 70%);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out forwards;
        `;

        // Ensure button has proper positioning
        const computedStyle = window.getComputedStyle(btn);
        if (computedStyle.position === 'static') {
            btn.style.position = 'relative';
        }
        btn.style.overflow = 'hidden';

        btn.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => ripple.remove(), 700);
    }
}

/**
 * Floating Header Animation
 */
class HeaderAnimationManager {
    constructor() {
        this.header = document.querySelector('.top-header');
        this.lastScrollY = 0;
        this.ticking = false;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleHeaderScroll(), { passive: true });
    }

    handleHeaderScroll() {
        if (!this.header) return;

        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            this.header.classList.add('scrolled');
            this.header.style.background = 'rgba(10, 14, 39, 0.95)';
            this.header.style.backdropFilter = 'blur(20px)';
        } else {
            this.header.classList.remove('scrolled');
            this.header.style.background = 'rgba(15, 20, 41, 0.8)';
            this.header.style.backdropFilter = 'blur(16px)';
        }
    }
}

/**
 * Text Animation on Scroll
 */
class TextAnimationManager {
    constructor() {
        this.init();
    }

    init() {
        // Only add data-scroll to section headers, NOT the main header
        const textElements = document.querySelectorAll('.learn-section h2, .help-section h2, .developers-section h2, .about-section h2, .video-demo-description');
        
        textElements.forEach(el => {
            if (!el.hasAttribute('data-scroll')) {
                el.setAttribute('data-scroll', 'fade-up');
            }
        });
    }
}

/**
 * Initialize all systems on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    // Create global animator instance
    window.scrollAnimator = new AdvancedScrollAnimator();
    
    // Initialize other managers
    new SmoothScrollEnhancer();
    new CardInteractionManager();
    new RippleEffectManager();
    new HeaderAnimationManager();
    new TextAnimationManager();
    new ParallaxHeroManager();
    new CounterAnimationManager();
    new StaggeredRevealManager();
    new MagneticButtonManager();
    new EnhancedAnimationManager();
    new VideoDemoManager();

    console.log('✨ Advanced scroll animation system initialized');
});

/**
 * Parallax Hero Effect
 */
class ParallaxHeroManager {
    constructor() {
        this.heroContent = document.querySelector('.hero-content');
        this.heroVisual = document.querySelector('.hero-visual');
        this.heroSection = document.querySelector('.hero-section');
        this.init();
    }

    init() {
        if (!this.heroSection) return;
        window.addEventListener('scroll', () => this.handleParallax(), { passive: true });
    }

    handleParallax() {
        const scrollY = window.scrollY;
        const heroHeight = this.heroSection?.offsetHeight || 800;
        const scrollProgress = Math.min(scrollY / heroHeight, 1);

        if (this.heroContent) {
            this.heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
            this.heroContent.style.opacity = 1 - scrollProgress * 0.8;
        }

        if (this.heroVisual) {
            this.heroVisual.style.transform = `translateY(${scrollY * -0.2}px) scale(${1 - scrollProgress * 0.1})`;
            this.heroVisual.style.opacity = 1 - scrollProgress * 0.6;
        }
    }
}

/**
 * Counter Animation Manager
 */
class CounterAnimationManager {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number[data-count]');
        this.animated = new Set();
        this.init();
    }

    init() {
        if (this.counters.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animateCounter(entry.target);
                    this.animated.add(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(counter) {
        const target = parseInt(counter.dataset.count);
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);

            counter.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        requestAnimationFrame(updateCounter);
    }
}

/**
 * Staggered Reveal Manager
 */
class StaggeredRevealManager {
    constructor() {
        this.init();
    }

    init() {
        const containers = [
            { selector: '.info-grid', items: '.info-item' },
            { selector: '.team-grid', items: '.dev-card' },
            { selector: '.faq-container', items: '.faq-item' },
            { selector: '.about-content', items: '.about-card' }
        ];

        containers.forEach(({ selector, items }) => {
            const container = document.querySelector(selector);
            if (!container) return;

            const elements = container.querySelectorAll(items);

            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    elements.forEach((el, index) => {
                        setTimeout(() => {
                            el.classList.add('visible');
                        }, index * 100); // 100ms stagger
                    });
                    observer.disconnect();
                }
            }, { threshold: 0.1 });

            observer.observe(container);
        });
    }
}

/**
 * Magnetic Button Effect
 */
class MagneticButtonManager {
    constructor() {
        this.buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-large');
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => this.handleMouseMove(e, btn));
            btn.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, btn));
        });
    }

    handleMouseMove(e, btn) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Subtle magnetic pull effect
        const pullStrength = 0.15;
        btn.style.transform = `translate(${x * pullStrength}px, ${y * pullStrength}px)`;
    }

    handleMouseLeave(e, btn) {
        btn.style.transform = 'translate(0, 0)';
    }
}

/**
 * Enhanced Section Animation Manager
 */
class EnhancedAnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollProgress();
        this.setupUploadAnimations();
        this.setupItemIndexes();
        this.setupResultCelebration();
        this.setupSectionObservers();
    }

    // Global scroll progress bar
    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress-bar';
        progressBar.style.width = '0%';
        document.body.prepend(progressBar);

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }, { passive: true });
    }

    // Upload area success animation
    setupUploadAnimations() {
        const uploadAreas = document.querySelectorAll('.upload-area');

        uploadAreas.forEach(area => {
            const input = area.querySelector('input[type="file"]');
            if (!input) return;

            input.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    area.classList.add('success');

                    // Create burst particles
                    this.createUploadParticles(area);

                    setTimeout(() => area.classList.remove('success'), 1000);
                }
            });
        });
    }

    // Create particle burst effect on upload
    createUploadParticles(container) {
        const colors = ['#7c8cff', '#64d9a5', '#ffa07a'];
        const particleCount = 12;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                left: 50%;
                top: 50%;
                pointer-events: none;
                z-index: 100;
            `;

            const angle = (i / particleCount) * Math.PI * 2;
            const velocity = 50 + Math.random() * 50;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            particle.animate([
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
            ], {
                duration: 600,
                easing: 'cubic-bezier(0, 0.5, 0.5, 1)'
            });

            container.appendChild(particle);
            setTimeout(() => particle.remove(), 600);
        }
    }

    // Set item indexes for staggered animations
    setupItemIndexes() {
        const containers = [
            '.info-grid .info-item',
            '.faq-container .faq-item',
            '.team-grid .dev-card',
            '.about-content .about-card'
        ];

        containers.forEach(selector => {
            document.querySelectorAll(selector).forEach((item, index) => {
                item.style.setProperty('--item-index', index);
            });
        });
    }

    // Result celebration effect
    setupResultCelebration() {
        // Create a MutationObserver to watch for result boxes becoming visible
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('result-box') &&
                        !target.classList.contains('hidden')) {
                        this.triggerCelebration(target);
                    }
                }
            });
        });

        document.querySelectorAll('.result-box').forEach(box => {
            observer.observe(box, { attributes: true, attributeFilter: ['class'] });
        });
    }

    // Trigger celebration particles
    triggerCelebration(element) {
        const emojis = ['🎉', '✨', '🎊', '⭐', '💫'];
        const particleCount = 8;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('span');
            particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            particle.style.cssText = `
                position: absolute;
                font-size: ${16 + Math.random() * 16}px;
                left: ${10 + Math.random() * 80}%;
                top: 0;
                pointer-events: none;
                z-index: 100;
            `;

            const tx = (Math.random() - 0.5) * 100;
            const ty = -50 - Math.random() * 100;
            const rotation = Math.random() * 720 - 360;

            particle.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) rotate(${rotation}deg)`, opacity: 0 }
            ], {
                duration: 1000 + Math.random() * 500,
                easing: 'cubic-bezier(0, 0.5, 0.5, 1)',
                delay: Math.random() * 200
            });

            element.appendChild(particle);
            setTimeout(() => particle.remove(), 1500);
        }
    }

    // Setup observers for section animations
    setupSectionObservers() {
        const sections = document.querySelectorAll('.learn-section, .help-section, .developers-section, .about-section');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => observer.observe(section));
    }
}

/**
 * Video Demo Interactive Manager - FIXED VERSION
 */
class VideoDemoManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 1500; // 1.5 seconds per step
        this.isHovered = false;
        this.isInitialized = false;
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.steps = document.querySelectorAll('.video-step');
        this.dots = document.querySelectorAll('.progress-dots .dot');
        this.progressFill = document.querySelector('.progress-fill');
        this.progressBar = document.querySelector('.video-progress-bar');
        this.demoSection = document.querySelector('.video-demo-section');

        if (this.steps.length === 0) {
            console.log('⚠️ Video demo steps not found, retrying...');
            setTimeout(() => this.setup(), 500);
            return;
        }

        console.log('✅ Video demo initialized with', this.steps.length, 'steps');

        this.isInitialized = true;
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.goToStep(1); // Start at step 1
    }

    setupEventListeners() {
        // Click on steps
        this.steps.forEach((step, index) => {
            step.addEventListener('click', () => {
                console.log('Step clicked:', index + 1);
                this.goToStep(index + 1);
                this.restartAutoPlay();
            });
        });

        // Click on dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                console.log('Dot clicked:', index + 1);
                this.goToStep(index + 1);
                this.restartAutoPlay();
            });
        });

        // Pause on hover
        if (this.demoSection) {
            this.demoSection.addEventListener('mouseenter', () => {
                this.isHovered = true;
                this.pauseAutoPlay();
                console.log('Auto-play paused (hover)');
            });

            this.demoSection.addEventListener('mouseleave', () => {
                this.isHovered = false;
                this.startAutoPlay();
                console.log('Auto-play resumed');
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isInViewport()) return;

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                this.nextStep();
                this.restartAutoPlay();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.prevStep();
                this.restartAutoPlay();
            }
        });
    }

    goToStep(stepNumber) {
        if (!this.isInitialized) return;
        
        this.currentStep = stepNumber;
        console.log('Going to step:', stepNumber);

        // Update steps
        this.steps.forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.remove('active', 'completed');

            if (stepNum === this.currentStep) {
                step.classList.add('active');
            } else if (stepNum < this.currentStep) {
                step.classList.add('completed');
            }
        });

        // Update dots
        this.dots.forEach((dot, index) => {
            const stepNum = index + 1;
            dot.classList.remove('active', 'completed');

            if (stepNum === this.currentStep) {
                dot.classList.add('active');
            } else if (stepNum < this.currentStep) {
                dot.classList.add('completed');
            }
        });

        this.updateProgress();
    }

    nextStep() {
        const next = this.currentStep >= this.totalSteps ? 1 : this.currentStep + 1;
        this.goToStep(next);
    }

    prevStep() {
        const prev = this.currentStep <= 1 ? this.totalSteps : this.currentStep - 1;
        this.goToStep(prev);
    }

    updateProgress() {
        if (!this.isInitialized) return;
        
        const progress = (this.currentStep / this.totalSteps) * 100;

        if (this.progressFill) {
            this.progressFill.style.width = `${progress}%`;
        }

        if (this.progressBar) {
            this.progressBar.style.width = `${progress}%`;
        }
    }

    startAutoPlay() {
        if (this.autoPlayInterval || this.isHovered || !this.isInitialized) {
            return;
        }

        console.log('🎬 Auto-play started');
        this.autoPlayInterval = setInterval(() => {
            this.nextStep();
            console.log('Auto-advancing to step:', this.currentStep);
        }, this.autoPlayDelay);
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
            console.log('⏸️ Auto-play paused');
        }
    }

    restartAutoPlay() {
        this.pauseAutoPlay();
        if (!this.isHovered) {
            this.startAutoPlay();
        }
    }

    isInViewport() {
        if (!this.demoSection) return false;
        const rect = this.demoSection.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }
}

// Make sure VideoDemoManager is initialized
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🎥 Initializing Video Demo Manager...');
        window.videoDemoManager = new VideoDemoManager();
    });
} else {
    console.log('🎥 Initializing Video Demo Manager...');
    window.videoDemoManager = new VideoDemoManager();
}

/**
 * Cleanup on page unload
 */
window.addEventListener('beforeunload', () => {
    if (window.scrollAnimator) {
        window.scrollAnimator.destroy();
    }
});

/**
 * Global easing functions for advanced animations
 */
window.EasingFunctions = {
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: t => t * t * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * (t - 2)) * (2 * (t - 2)) + 1,
    easeInQuart: t => t * t * t * t,
    easeOutQuart: t => 1 - (--t) * t * t * t,
    easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
    easeOutBounce: t => {
        if ((t) < (1 / 2.75)) {
            return (7.5625 * t * t);
        } else if (t < (2 / 2.75)) {
            return (7.5625 * (t -= (1.5 / 2.75)) * t + .75);
        } else if (t < (2.5 / 2.75)) {
            return (7.5625 * (t -= (2.25 / 2.75)) * t + .9375);
        } else {
            return (7.5625 * (t -= (2.625 / 2.75)) * t + 1);
        }
    }
};