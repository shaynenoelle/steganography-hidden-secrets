/**
 * Reusable Footer Component
 * Injects the footer HTML and all modals into all pages
 */

(function() {
    const footerHTML = `
    <!-- Footer -->
    <footer class="site-footer">
        <div class="footer-content">
            <span class="copyright">© 2025 Hidden Secrets</span>
            <span class="divider">|</span>
            <a href="#" class="footer-link" id="shortcutsLink"><i class="fas fa-keyboard"></i> Shortcuts</a>
            <span class="divider">|</span>
            <a href="#" class="footer-link" id="privacyLink">Privacy Policy</a>
            <span class="divider">|</span>
            <a href="#" class="footer-link" id="termsLink">Terms of Service</a>
            <span class="divider">|</span>
            <a href="#" class="footer-link" id="contactLink">Contact</a>
        </div>
    </footer>

    <!-- Keyboard Shortcuts Modal -->
    <div class="modal-overlay" id="shortcutsModal">
        <div class="modal-content">
            <button class="modal-close" id="closeShortcuts">&times;</button>
            <h3><i class="fas fa-keyboard"></i> Keyboard Shortcuts</h3>
            <div class="shortcuts-list">
                <div class="shortcut-item">
                    <kbd>Alt</kbd> + <kbd>1</kbd>
                    <span>Switch to Embed tab</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Alt</kbd> + <kbd>2</kbd>
                    <span>Switch to Extract tab</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
                    <span>Submit current action</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Alt</kbd> + <kbd>T</kbd>
                    <span>Toggle dark/light theme</span>
                </div>
                <div class="shortcut-item">
                    <kbd>?</kbd>
                    <span>Show this help</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Esc</kbd>
                    <span>Close modal</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Privacy Policy Modal -->
    <div class="modal-overlay" id="privacyModal">
        <div class="modal-content legal-modal">
            <button class="modal-close" id="closePrivacy">&times;</button>
            <h3><i class="fas fa-shield-alt"></i> Privacy Policy</h3>
            <div class="legal-content">
                <p class="legal-updated">Last updated: December 10, 2025</p>

                <div class="legal-section">
                    <h4><i class="fas fa-lock"></i> Our Commitment to Privacy</h4>
                    <p>Hidden Secrets is committed to protecting your privacy. This tool operates entirely in your browser, ensuring your data stays on your device.</p>
                </div>

                <div class="legal-section">
                    <h4><i class="fas fa-database"></i> Data Collection</h4>
                    <p><strong>We do not collect:</strong></p>
                    <ul>
                        <li>Your uploaded images</li>
                        <li>Your watermark text or messages</li>
                        <li>Your passwords or encryption keys</li>
                        <li>Any personal information</li>
                    </ul>
                </div>

                <div class="legal-section">
                    <h4><i class="fas fa-laptop"></i> Local Processing</h4>
                    <p>All image processing, watermark embedding, and extraction happens locally in your web browser using JavaScript. No data is ever transmitted to our servers or any third-party services.</p>
                </div>

                <div class="legal-section">
                    <h4><i class="fas fa-cookie"></i> Cookies & Storage</h4>
                    <p>We may use local storage to save your theme preference (dark/light mode). No tracking cookies are used. No analytics services are implemented.</p>
                </div>

                <div class="legal-section">
                    <h4><i class="fas fa-globe"></i> Third-Party Services</h4>
                    <p>We use Font Awesome icons loaded from a CDN. This is the only external resource loaded. No user data is shared with third parties.</p>
                </div>

                <div class="legal-section">
                    <h4><i class="fas fa-envelope"></i> Contact</h4>
                    <p>For privacy-related questions, please use the contact form on this website.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Terms of Service Modal -->
    <div class="modal-overlay" id="termsModal">
        <div class="modal-content legal-modal">
            <button class="modal-close" id="closeTerms">&times;</button>
            <h3><i class="fas fa-file-contract"></i> Terms of Service</h3>
            <div class="legal-content">
                <p class="legal-updated">Last updated: December 10, 2025</p>

                <div class="legal-section">
                    <h4><i class="fas fa-check-circle"></i> Acceptance of Terms</h4>
                    <p>By using Hidden Secrets, you agree to these Terms of Service. If you do not agree, please do not use this service.</p>
                </div>

                <div class="legal-section">
                    <h4><i class="fas fa-tools"></i> Service Description</h4>
                    <p>Hidden Secrets is a free, browser-based steganography tool that allows you to embed invisible watermarks into images using LSB (Least Significant Bit) technology.</p>
                </div>

                <div class="legal-section">
                    <h4><i class="fas fa-user-check"></i> Acceptable Use</h4>
                    <p><strong>You agree to use this tool only for:</strong></p>
                    <ul>
                        <li>Protecting your own creative works</li>
                        <li>Adding copyright information to your images</li>
                        <li>Educational and research purposes</li>
                        <li>Lawful purposes in your jurisdiction</li>
                    </ul>
                    <p><strong>You agree NOT to use this tool for:</strong></p>
                    <ul>
                        <li>Hiding illegal content</li>
                        <li>Circumventing digital rights management</li>
                        <li>Any fraudulent or deceptive purposes</li>
                        <li>Violating intellectual property rights of others</li>
                    </ul>
                </div>

                <div class="legal-section">
                    <h4><i class="fas fa-exclamation-triangle"></i> Disclaimer</h4>
                    <p>This tool is provided "as is" without warranties of any kind. We are not responsible for:</p>
                    <ul>
                        <li>Loss of data or image quality</li>
                        <li>Unintended disclosure of hidden messages</li>
                        <li>Any damages arising from use of this tool</li>
                    </ul>
                </div>

                <div class="legal-section">
                    <h4><i class="fas fa-copyright"></i> Intellectual Property</h4>
                    <p>You retain all rights to your images and content. We claim no ownership over any images processed through this tool.</p>
                </div>

                <div class="legal-section">
                    <h4><i class="fas fa-sync"></i> Changes to Terms</h4>
                    <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of updated terms.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Contact Modal -->
    <div class="modal-overlay" id="contactModal">
        <div class="modal-content contact-modal">
            <button class="modal-close" id="closeContact">&times;</button>
            <h3><i class="fas fa-envelope"></i> Contact Us</h3>
            <div class="contact-content">
                <p class="contact-intro">Have questions, feedback, or need support? We'd love to hear from you!</p>

                <form id="contactForm" class="contact-form">
                    <div class="form-group">
                        <label for="contactName"><i class="fas fa-user"></i> Name</label>
                        <input type="text" id="contactName" name="name" placeholder="Your name" required>
                    </div>

                    <div class="form-group">
                        <label for="contactEmail"><i class="fas fa-envelope"></i> Email</label>
                        <input type="email" id="contactEmail" name="email" placeholder="your@email.com" required>
                    </div>

                    <div class="form-group">
                        <label for="contactSubject"><i class="fas fa-tag"></i> Subject</label>
                        <select id="contactSubject" name="subject" required>
                            <option value="">Select a topic...</option>
                            <option value="general">General Inquiry</option>
                            <option value="support">Technical Support</option>
                            <option value="feedback">Feedback & Suggestions</option>
                            <option value="bug">Bug Report</option>
                            <option value="business">Business Inquiry</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="contactMessage"><i class="fas fa-comment-alt"></i> Message</label>
                        <textarea id="contactMessage" name="message" placeholder="Your message..." rows="5" required></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary contact-submit">
                        <i class="fas fa-paper-plane"></i> Send Message
                    </button>
                </form>

                <div class="contact-success hidden" id="contactSuccess">
                    <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                    <h4>Message Sent!</h4>
                    <p>Thank you for reaching out. We'll get back to you as soon as possible.</p>
                </div>

                <div class="contact-alternatives">
                    <p>Or reach us through:</p>
                    <div class="contact-links">
                        <a href="mailto:princengojo@g.cjc.edu.ph" class="contact-alt-link">
                            <i class="fas fa-envelope"></i> princengojo@g.cjc.edu.ph
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    // Function to inject footer
    function injectFooter() {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = footerHTML;
            footerPlaceholder.classList.add('loaded');
            // CRITICAL: Initialize modals AFTER HTML is injected
            initFooterModals();
            console.log('✅ Footer injected and modals initialized');
        }
    }

    // Initialize footer modal functionality
    function initFooterModals() {
        // Modal Elements
        const privacyModal = document.getElementById('privacyModal');
        const termsModal = document.getElementById('termsModal');
        const contactModal = document.getElementById('contactModal');
        const shortcutsModal = document.getElementById('shortcutsModal');

        const privacyLink = document.getElementById('privacyLink');
        const termsLink = document.getElementById('termsLink');
        const contactLink = document.getElementById('contactLink');
        const shortcutsLink = document.getElementById('shortcutsLink');

        const closePrivacy = document.getElementById('closePrivacy');
        const closeTerms = document.getElementById('closeTerms');
        const closeContact = document.getElementById('closeContact');
        const closeShortcuts = document.getElementById('closeShortcuts');

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
            openFooterModal(shortcutsModal);
        });

        closeShortcuts?.addEventListener('click', () => {
            closeFooterModal(shortcutsModal);
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
                closeFooterModal(shortcutsModal);
            }
        });

        // Contact Form Handling
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
                if (typeof showNotification === 'function') {
                    showNotification('Please fill in all fields', 'error');
                }
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                if (typeof showNotification === 'function') {
                    showNotification('Please enter a valid email address', 'error');
                }
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
                if (typeof showNotification === 'function') {
                    showNotification('Message sent successfully!', 'success');
                }

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
    }

    // Wait for full page load before injecting footer
    if (document.readyState === 'complete') {
        injectFooter();
    } else {
        window.addEventListener('load', injectFooter);
    }
})();