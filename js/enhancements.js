/* ============================================
   ENHANCEMENTS JS
   ============================================
   Loading screen, theme toggle, keyboard shortcuts,
   progress bars, notifications, and UI improvements
   ============================================ */


// ============ LOADING SCREEN ============
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Hide loading screen after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 1500);
    });

    // Fallback: hide after 3 seconds max
    setTimeout(() => {
        if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
            loadingScreen.classList.add('hidden');
        }
    }, 3000);
});

// ============ THEME TOGGLE ============
// Theme toggle is now initialized in components/header.js
// This ensures it works after the header is injected dynamically
/*const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('.theme-icon');

// Check saved theme or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
if (themeIcon) {
    themeIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
}

themeToggle?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (themeIcon) {
        themeIcon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    }
    
    showNotification(`Switched to ${newTheme} mode`, 'info');
});*/


// ============ NOTIFICATIONS ============
function showNotification(message, type = 'info') {
    let container = document.querySelector('.notification-container');
    
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ'
    };
    
    notification.innerHTML = `
        <span class="notification-icon">${icons[type] || icons.info}</span>
        <span class="notification-message">${message}</span>
    `;
    
    container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// Make showNotification globally available
window.showNotification = showNotification;

// ============ MODALS ============
const shortcutsModal = document.getElementById('shortcutsModal');
const howItWorksModal = document.getElementById('howItWorksModal');
const closeShortcuts = document.getElementById('closeShortcuts');
const closeHowItWorks = document.getElementById('closeHowItWorks');
const helpBtn = document.getElementById('helpBtn');
const miniHowItWorks = document.getElementById('miniHowItWorks');
const miniClose = document.getElementById('closeMiniHowItWorks');

// Open how it works modal
function openHowItWorksModal() {
    if (howItWorksModal) {
        howItWorksModal.classList.add('active');
    }
}

// Close how it works modal
function closeHowItWorksModal() {
    if (howItWorksModal) {
        howItWorksModal.classList.remove('active');
    }
}

// Open shortcuts modal
function openShortcutsModal() {
    if (shortcutsModal) {
        shortcutsModal.classList.add('active');
    }
}

// Close shortcuts modal
function closeShortcutsModal() {
    if (shortcutsModal) {
        shortcutsModal.classList.remove('active');
    }
}

// Open mini how it works popup
function openMiniHowItWorks() {
    if (miniHowItWorks) {
        miniHowItWorks.classList.add('active');
    }
}

// Close mini how it works popup
function closeMiniHowItWorks() {
    if (miniHowItWorks) {
        miniHowItWorks.classList.remove('active');
    }
}
helpBtn?.addEventListener('click', () => {
    console.log('Help button clicked');
    // Always open the mini popup when button is clicked
    openMiniHowItWorks();
});
closeHowItWorks?.addEventListener('click', closeHowItWorksModal);
closeShortcuts?.addEventListener('click', closeShortcutsModal);
miniClose?.addEventListener('click', closeMiniHowItWorks);

// Close modals on overlay click
howItWorksModal?.addEventListener('click', (e) => {
    if (e.target === howItWorksModal) {
        closeHowItWorksModal();
    }
});

shortcutsModal?.addEventListener('click', (e) => {
    if (e.target === shortcutsModal) {
        closeShortcutsModal();
    }
});

miniHowItWorks?.addEventListener('click', (e) => {
    if (e.target === miniHowItWorks) {
        closeMiniHowItWorks();
    }
});

// Keyboard event listener
document.addEventListener('keydown', (e) => {
    // Don't trigger if typing in input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        // Allow Escape key even in inputs
        if (e.key === 'Escape') {
            closeShortcutsModal();
            closeMiniHowItWorks();
            e.target.blur();
        }
        return;
    }

    // ? key - Show shortcuts
    if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        openShortcutsModal();
    }

    // Escape - Close modal
    if (e.key === 'Escape') {
        closeShortcutsModal();
        closeMiniHowItWorks();
    }
    
    // Alt + 1 - Switch to Embed tab
    if (e.altKey && e.key === '1') {
        e.preventDefault();
        const embedTab = document.querySelector('[data-tab="embed"]');
        embedTab?.click();
        showNotification('Switched to Embed tab', 'info');
    }
    
    // Alt + 2 - Switch to Extract tab
    if (e.altKey && e.key === '2') {
        e.preventDefault();
        const extractTab = document.querySelector('[data-tab="extract"]');
        extractTab?.click();
        showNotification('Switched to Extract tab', 'info');
    }
    
    // Ctrl/Cmd + Enter - Submit current form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab) {
            const submitBtn = activeTab.querySelector('.btn-primary');
            submitBtn?.click();
        }
    }
    
    // Alt + T - Toggle theme
    if (e.altKey && e.key === 't') {
        e.preventDefault();
        themeToggle?.click();
    }
    
    // Alt + D - Download (if available)
    if (e.altKey && e.key === 'd') {
        e.preventDefault();
        const downloadBtn = document.querySelector('.btn-primary[id*="download"], .btn-primary:contains("Download")');
        if (downloadBtn && !downloadBtn.disabled) {
            downloadBtn.click();
        }
    }
});

// ============ WATERMARK STRENGTH INDICATOR ============
const watermarkInput = document.getElementById('watermarkText');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');

function updateStrengthIndicator(text) {
    if (!strengthFill || !strengthText) return;
    
    const length = text.length;
    let strength = 'none';
    let message = 'Enter watermark text';
    
    if (length === 0) {
        strength = 'none';
        message = 'Enter watermark text';
    } else if (length < 5) {
        strength = 'weak';
        message = 'Too short - add more characters';
    } else if (length < 15) {
        strength = 'fair';
        message = 'Fair - consider adding more detail';
    } else if (length < 30) {
        strength = 'good';
        message = 'Good watermark strength';
    } else {
        strength = 'strong';
        message = 'Excellent watermark strength!';
    }
    
    // Remove all strength classes
    strengthFill.className = 'strength-fill';
    strengthText.className = 'strength-text';
    
    if (strength !== 'none') {
        strengthFill.classList.add(strength);
        strengthText.classList.add(strength);
    }
    
    strengthText.textContent = message;
}

watermarkInput?.addEventListener('input', (e) => {
    updateStrengthIndicator(e.target.value);
});

// Initialize strength indicator
if (watermarkInput) {
    updateStrengthIndicator(watermarkInput.value);
}

// ============ COPY TO CLIPBOARD ============
const copyBtn = document.getElementById('copyWatermark');

copyBtn?.addEventListener('click', async () => {
    const extractedText = document.getElementById('extractedWatermark')?.textContent ||
                          document.getElementById('extractedText')?.textContent;
    
    if (extractedText && extractedText.trim()) {
        try {
            await navigator.clipboard.writeText(extractedText);
            copyBtn.classList.add('copied');
            copyBtn.innerHTML = '✓ Copied!';
            showNotification('Watermark copied to clipboard!', 'success');
            
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.innerHTML = '📋 Copy';
            }, 2000);
        } catch (err) {
            showNotification('Failed to copy to clipboard', 'error');
        }
    } else {
        showNotification('No watermark text to copy', 'error');
    }
});

// ============ SUCCESS ANIMATION ============
function showSuccessAnimation(message = 'Success!') {
    let overlay = document.querySelector('.success-overlay');
    
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'success-overlay';
        overlay.innerHTML = `
            <div class="success-checkmark">
                <div class="checkmark-circle">
                    <span class="checkmark-icon">✓</span>
                </div>
                <div class="success-text">${message}</div>
            </div>
        `;
        document.body.appendChild(overlay);
    } else {
        overlay.querySelector('.success-text').textContent = message;
    }
    
    overlay.classList.add('active');
    
    // Hide after 2 seconds
    setTimeout(() => {
        overlay.classList.remove('active');
    }, 2000);
}

// Make it globally available
window.showSuccessAnimation = showSuccessAnimation;

// ============ PROGRESS BAR ============
function showProgress(containerId, progress, text = '') {
    const container = document.getElementById(containerId);
    const bar = document.getElementById(containerId + 'Bar');
    const textEl = document.getElementById(containerId + 'Text');
    
    if (container) {
        container.classList.add('active');
    }
    
    if (bar) {
        bar.style.width = `${progress}%`;
    }
    
    if (textEl && text) {
        textEl.textContent = text;
    }
}

function hideProgress(containerId) {
    const container = document.getElementById(containerId);
    const bar = document.getElementById(containerId + 'Bar');
    
    if (container) {
        container.classList.remove('active');
    }
    
    if (bar) {
        bar.style.width = '0%';
    }
}

// Make progress functions globally available
window.showProgress = showProgress;
window.hideProgress = hideProgress;

// ============ IMAGE COMPARISON SLIDER ============
function initImageComparison(container) {
    if (!container) return;
    
    const overlay = container.querySelector('.image-compare-overlay');
    const slider = container.querySelector('.image-compare-slider');
    
    if (!overlay || !slider) return;
    
    let isDragging = false;
    
    function updatePosition(x) {
        const rect = container.getBoundingClientRect();
        let position = ((x - rect.left) / rect.width) * 100;
        position = Math.max(0, Math.min(100, position));
        
        overlay.style.width = `${position}%`;
        slider.style.left = `${position}%`;
    }
    
    function startDrag(e) {
        isDragging = true;
        e.preventDefault();
    }
    
    function stopDrag() {
        isDragging = false;
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        updatePosition(x);
    }
    
    // Mouse events
    slider.addEventListener('mousedown', startDrag);
    container.addEventListener('mousedown', (e) => {
        if (e.target === container || e.target.tagName === 'IMG') {
            startDrag(e);
            const x = e.clientX;
            updatePosition(x);
        }
    });
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    
    // Touch events
    slider.addEventListener('touchstart', startDrag);
    container.addEventListener('touchstart', (e) => {
        if (e.target === container || e.target.tagName === 'IMG') {
            startDrag(e);
            const x = e.touches[0].clientX;
            updatePosition(x);
        }
    });
    
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', stopDrag);
}

// Initialize all comparison sliders
document.querySelectorAll('.image-compare-container').forEach(initImageComparison);

// Make it available for dynamically created comparisons
window.initImageComparison = initImageComparison;

// ============ SMOOTH SCROLL FOR ANCHORS ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============ FORM VALIDATION ENHANCEMENT ============
const forms = document.querySelectorAll('form');

forms.forEach(form => {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (!input.value.trim()) {
                input.classList.add('invalid');
            } else {
                input.classList.remove('invalid');
            }
        });
        
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                input.classList.remove('invalid');
            }
        });
    });
});

// ============ DOUBLE-CLICK TO ZOOM IMAGE ============
document.querySelectorAll('.image-preview, .result-image').forEach(img => {
    img.style.cursor = 'zoom-in';
    
    img.addEventListener('dblclick', () => {
        const overlay = document.createElement('div');
        overlay.className = 'image-zoom-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            cursor: zoom-out;
        `;
        
        const zoomedImg = document.createElement('img');
        zoomedImg.src = img.src;
        zoomedImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 0 50px rgba(0, 217, 255, 0.3);
        `;
        
        overlay.appendChild(zoomedImg);
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', () => {
            overlay.remove();
        });
        
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', escHandler);
            }
        });
    });
});

// ============ SCROLL PROGRESS INDICATOR ============
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    if (scrollProgress) {
        scrollProgress.style.width = scrollPercent + '%';
    }
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

// ============ BACK TO TOP BUTTON ============
const backToTopBtn = document.getElementById('backToTop');

function toggleBackToTop() {
    if (window.scrollY > 500) {
        backToTopBtn?.classList.add('visible');
    } else {
        backToTopBtn?.classList.remove('visible');
    }
}

backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', toggleBackToTop, { passive: true });
toggleBackToTop();

// ============ ANIMATED COUNTER ============
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        let hasAnimated = false;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start animation when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

animateCounters();

// ============ CURSOR TRAIL EFFECT ============
const cursorTrail = document.getElementById('cursorTrail');
const cursorDot = document.getElementById('cursorDot');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

// Only enable on non-touch devices
if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot?.classList.add('active');
        cursorTrail?.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
        cursorDot?.classList.remove('active');
        cursorTrail?.classList.remove('active');
    });

    function animateCursor() {
        trailX += (mouseX - trailX) * 0.15;
        trailY += (mouseY - trailY) * 0.15;
        
        if (cursorDot) {
            cursorDot.style.left = mouseX - 4 + 'px';
            cursorDot.style.top = mouseY - 4 + 'px';
        }
        
        if (cursorTrail) {
            cursorTrail.style.left = trailX - 10 + 'px';
            cursorTrail.style.top = trailY - 10 + 'px';
        }
        
        requestAnimationFrame(animateCursor);
    }

    animateCursor();
}

// ============ INITIALIZE ============
console.log('✨ Enhancements loaded successfully!');

// ============ FOOTER MODALS (Privacy, Terms, Contact) ============

// Modal Elements
const privacyModal = document.getElementById('privacyModal');
const termsModal = document.getElementById('termsModal');
const contactModal = document.getElementById('contactModal');

const privacyLink = document.getElementById('privacyLink');
const termsLink = document.getElementById('termsLink');
const contactLink = document.getElementById('contactLink');
const shortcutsLink = document.getElementById('shortcutsLink');

const closePrivacy = document.getElementById('closePrivacy');
const closeTerms = document.getElementById('closeTerms');
const closeContact = document.getElementById('closeContact');

// Open Modal Function
function openFooterModal(modal) {
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close Modal Function
function closeFooterModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Privacy Policy Modal
privacyLink?.addEventListener('click', (e) => {
    e.preventDefault();
    openFooterModal(privacyModal);
});

closePrivacy?.addEventListener('click', () => {
    closeFooterModal(privacyModal);
});

// Terms of Service Modal
termsLink?.addEventListener('click', (e) => {
    e.preventDefault();
    openFooterModal(termsModal);
});

closeTerms?.addEventListener('click', () => {
    closeFooterModal(termsModal);
});

// Contact Modal
contactLink?.addEventListener('click', (e) => {
    e.preventDefault();
    openFooterModal(contactModal);
});

closeContact?.addEventListener('click', () => {
    closeFooterModal(contactModal);
});

// Shortcuts Modal
shortcutsLink?.addEventListener('click', (e) => {
    e.preventDefault();
    openShortcutsModal();
});

// Close modals on overlay click
[privacyModal, termsModal, contactModal, shortcutsModal].forEach(modal => {
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeFooterModal(modal);
        }
    });
});

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeFooterModal(privacyModal);
        closeFooterModal(termsModal);
        closeFooterModal(contactModal);
        closeShortcutsModal();
    }
});

// ============ CONTACT FORM HANDLING ============
const contactForm = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');

contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };

    // Validate
    if (!data.name || !data.email || !data.subject || !data.message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Simulate form submission
    const submitBtn = contactForm.querySelector('.contact-submit');
    const originalText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simulate API delay
    setTimeout(() => {
        // Hide form, show success
        contactForm.classList.add('hidden');
        contactSuccess.classList.remove('hidden');

        // Show notification
        showNotification('Message sent successfully!', 'success');

        // Reset form
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Reset modal after 5 seconds
        setTimeout(() => {
            contactForm.classList.remove('hidden');
            contactSuccess.classList.add('hidden');
        }, 5000);

    }, 1500);
});

console.log('📧 Footer modals initialized');

(function(){
  const chevron = document.getElementById('heroChevron');
  const target = document.getElementById('how-it-works');
  if (!chevron || !target) return;

  chevron.addEventListener('click', function(e){
    e.preventDefault();
    // smooth-scroll and focus target for screen readers
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target.setAttribute('tabindex', '-1'); // make focusable
    target.focus({ preventScroll: true });
    setTimeout(() => target.removeAttribute('tabindex'), 1200);
  });
})();
