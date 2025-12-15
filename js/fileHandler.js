// Notification system for user feedback
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'rgba(0, 255, 65, 0.1)' : 
                    type === 'error' ? 'rgba(255, 55, 75, 0.1)' : 
                    'rgba(0, 217, 255, 0.1)';
    const borderColor = type === 'success' ? '#00ff41' : 
                        type === 'error' ? '#ff374b' : 
                        '#00d9ff';
    const textColor = type === 'success' ? '#00ff41' : 
                      type === 'error' ? '#ff374b' : 
                      '#00d9ff';
    
    notification.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        padding: 14px 20px;
        background: ${bgColor};
        border: 1px solid ${borderColor};
        color: ${textColor};
        border-radius: 6px;
        z-index: 9999;
        font-weight: 600;
        font-size: 0.9em;
        animation: slideInRight 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 360px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Create animation styles if not present
    if (!document.querySelector('style[data-notification]')) {
        const style = document.createElement('style');
        style.setAttribute('data-notification', 'true');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100px);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Auto remove notification after 3.5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s cubic-bezier(0.23, 1, 0.32, 1) forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3500);
}

// Handle image upload for embedding with validation feedback
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('File size too large! Maximum 5MB allowed.', 'error');
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            showNotification('Invalid file type! Please upload an image.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            originalImageData = e.target.result;
            document.getElementById('originalImage').src = originalImageData;
            document.getElementById('imageComparison').classList.remove('hidden');
            
            // Reset watermarked image display
            document.getElementById('watermarkedImage').classList.add('hidden');
            document.getElementById('watermarkedPlaceholder').classList.remove('hidden');
            document.getElementById('downloadBtn').classList.add('hidden');
            watermarkedImageData = null;
            
            showNotification('Image uploaded successfully!', 'success');
        };
        reader.onerror = function() {
            showNotification('Error reading file!', 'error');
        };
        reader.readAsDataURL(file);
    }
}

// Handle image upload for extraction
function handleExtractImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        // Check file type
        if (!file.type.startsWith('image/')) {
            showNotification('Invalid file type! Please upload an image.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            watermarkedImageData = e.target.result;
            document.getElementById('extractPreviewImage').src = watermarkedImageData;
            document.getElementById('extractImagePreview').classList.remove('hidden');
            document.getElementById('extractedResult').classList.add('hidden');
            
            showNotification('Image loaded successfully!', 'success');
        };
        reader.onerror = function() {
            showNotification('Error reading file!', 'error');
        };
        reader.readAsDataURL(file);
    }
}

// Setup drag and drop for embed upload area
function setupEmbedDragDrop() {
    const uploadArea = document.querySelector('#embedTab .upload-area');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.style.borderColor = 'var(--accent-lime)';
            uploadArea.style.backgroundColor = 'rgba(0, 255, 65, 0.05)';
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.style.borderColor = 'var(--border-primary)';
            uploadArea.style.backgroundColor = 'transparent';
        }, false);
    });
    
    uploadArea.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            document.getElementById('embedImageInput').files = files;
            handleImageUpload({ target: { files: files } });
        }
    }, false);
}

// Setup drag and drop for extract upload area
function setupExtractDragDrop() {
    const uploadArea = document.querySelector('#extractTab .upload-area');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.style.borderColor = 'var(--accent-lime)';
            uploadArea.style.backgroundColor = 'rgba(0, 255, 65, 0.05)';
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.style.borderColor = 'var(--border-primary)';
            uploadArea.style.backgroundColor = 'transparent';
        }, false);
    });
    
    uploadArea.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            document.getElementById('extractImageInput').files = files;
            handleExtractImageUpload({ target: { files: files } });
        }
    }, false);
}

// Initialize drag and drop on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setupEmbedDragDrop();
        setupExtractDragDrop();
    });
} else {
    setupEmbedDragDrop();
    setupExtractDragDrop();
}

// Download watermarked image with visual feedback
function downloadImage() {
    if (!watermarkedImageData) {
        showNotification('No watermarked image to download!', 'error');
        return;
    }
    
    const link = document.createElement('a');
    link.href = watermarkedImageData;
    link.download = 'watermarked-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Image downloaded successfully!', 'success');
}
