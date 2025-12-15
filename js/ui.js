// Global variables to store image data
let originalImageData = null;
let watermarkedImageData = null;

// Switch between Embed and Extract tabs with smooth transitions
function switchTab(tab) {
    // Remove active class from all tab buttons
    document.getElementById('embedTabBtn').classList.remove('active');
    document.getElementById('extractTabBtn').classList.remove('active');
    
    // Add active class to clicked tab button
    if (tab === 'embed') {
        document.getElementById('embedTabBtn').classList.add('active');
    } else {
        document.getElementById('extractTabBtn').classList.add('active');
    }

    // Hide all tab content with fade effect
    const embedTab = document.getElementById('embedTab');
    const extractTab = document.getElementById('extractTab');
    
    embedTab.classList.remove('active');
    extractTab.classList.remove('active');
    
    // Show selected tab content
    if (tab === 'embed') {
        embedTab.classList.add('active');
    } else {
        extractTab.classList.add('active');
    }
}

// Character Counter for Watermark Text
function initCharacterCounter() {
    const watermarkInput = document.getElementById('watermarkText');
    const charCount = document.getElementById('charCount');
    const charCounter = document.querySelector('.char-counter');

    if (watermarkInput && charCount) {
        watermarkInput.addEventListener('input', function() {
            const length = this.value.length;
            charCount.textContent = length;

            // Update counter color based on length
            if (length >= 900) {
                charCounter.classList.add('error');
                charCounter.classList.remove('warning');
            } else if (length >= 700) {
                charCounter.classList.add('warning');
                charCounter.classList.remove('error');
            } else {
                charCounter.classList.remove('warning', 'error');
            }
        });
    }
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const utilityNav = document.getElementById('utilityNav');

    if (mobileMenuToggle && utilityNav) {
        mobileMenuToggle.addEventListener('click', function() {
            utilityNav.classList.toggle('active');
            const icon = this.querySelector('i');
            if (utilityNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking a nav link
        const navLinks = utilityNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                utilityNav.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
}

// Toast Notification System
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';

    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);

    // Auto remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Drag and Drop for Upload Areas
function initDragDrop() {
    const uploadAreas = document.querySelectorAll('.upload-area');

    uploadAreas.forEach(area => {
        area.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });

        area.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
        });

        area.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const input = this.querySelector('input[type="file"]');
                if (input) {
                    // Create a new FileList-like object
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(files[0]);
                    input.files = dataTransfer.files;

                    // Trigger change event
                    const event = new Event('change', { bubbles: true });
                    input.dispatchEvent(event);
                }
            }
        });
    });
}

// Copy Watermark to Clipboard
function initCopyButton() {
    const copyBtn = document.getElementById('copyWatermark');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const extractedText = document.getElementById('extractedText');
            if (extractedText && extractedText.textContent) {
                navigator.clipboard.writeText(extractedText.textContent)
                    .then(() => showToast('Watermark copied to clipboard!', 'success'))
                    .catch(() => showToast('Failed to copy', 'error'));
            }
        });
    }
}

// Add keyboard shortcut support (Alt+1 and Alt+2)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all UI features
    initCharacterCounter();
    initMobileMenu();
    initDragDrop();
    initCopyButton();

    document.addEventListener('keydown', function(e) {
        if (e.altKey) {
            if (e.key === '1') {
                switchTab('embed');
                e.preventDefault();
            } else if (e.key === '2') {
                switchTab('extract');
                e.preventDefault();
            }
        }
    });
});
