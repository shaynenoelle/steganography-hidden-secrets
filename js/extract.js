// Extract watermark from image
async function extractWatermark() {
    if (!watermarkedImageData) {
        showNotification('Please upload a watermarked image first!', 'error');
        if (typeof showToast === 'function') showToast('Please upload an image first!', 'error');
        return;
    }

    // Get button and show loading state
    const btn = document.getElementById('extractBtn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoading = btn.querySelector('.btn-loading');

    btn.disabled = true;
    if (btnText && btnLoading) {
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
    }

    // Show progress bar
    const progressContainer = document.getElementById('extractProgress');
    const progressBar = document.getElementById('extractProgressBar');
    const progressText = document.getElementById('extractProgressText');

    if (progressContainer) {
        progressContainer.classList.add('active');
        progressContainer.style.display = 'block';
    }
    if (progressBar) progressBar.style.width = '20%';
    if (progressText) progressText.textContent = 'Reading image data...';

    const img = new Image();
    img.onload = async function() {
        try {
            if (progressBar) progressBar.style.width = '40%';
            if (progressText) progressText.textContent = 'Extracting hidden data...';

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Draw image on canvas
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Extract length (first 16 bits)
            let lengthBinary = '';
            for (let i = 0; i < 16; i++) {
                lengthBinary += (data[i * 4] & 1).toString();
            }
            const messageLength = parseInt(lengthBinary, 2);

            if (progressBar) progressBar.style.width = '60%';
            if (progressText) progressText.textContent = 'Decoding watermark...';

            // Validate message length
            if (messageLength <= 0 || messageLength > 1000) {
                showNotification('No valid watermark found in this image!', 'error');
                if (typeof showToast === 'function') showToast('No watermark found!', 'error');
                document.getElementById('extractedResult').classList.add('hidden');
                resetExtractButton();
                return;
            }

            // Extract message
            let messageBinary = '';
            for (let i = 16; i < 16 + (messageLength * 8); i++) {
                messageBinary += (data[i * 4] & 1).toString();
            }

            // Convert binary to text
            let extractedData = '';
            for (let i = 0; i < messageBinary.length; i += 8) {
                const byte = messageBinary.substr(i, 8);
                const charCode = parseInt(byte, 2);
                
                // Validate character code
                if (charCode < 32 || charCode > 126) {
                    if (charCode === 10 || charCode === 13 || (charCode >= 32 && charCode <= 255)) {
                        extractedData += String.fromCharCode(charCode);
                    }
                } else {
                    extractedData += String.fromCharCode(charCode);
                }
            }

            // Check if watermark is encrypted
            let message = extractedData;
            if (extractedData.startsWith('ENCRYPTED:')) {
                if (progressBar) progressBar.style.width = '80%';
                if (progressText) progressText.textContent = 'Decrypting watermark...';

                const parts = extractedData.split(':');
                if (parts.length < 3) {
                    showNotification('Invalid encrypted watermark format.', 'error');
                    resetExtractButton();
                    return;
                }

                const salt = parts[1];
                const encryptedHex = parts[2];
                const password = document.getElementById('extractPassword').value;

                if (!password) {
                    showNotification('This watermark is encrypted! Please enter the password to decrypt it.', 'error');
                    if (typeof showToast === 'function') showToast('Password required for encrypted watermark!', 'warning');
                    resetExtractButton();
                    return;
                }

                try {
                    message = await WatermarkCrypto.decryptWatermark(encryptedHex, password, salt);
                    if (!message) {
                        showNotification('Incorrect password! Could not decrypt watermark.', 'error');
                        if (typeof showToast === 'function') showToast('Incorrect password!', 'error');
                        document.getElementById('extractedResult').classList.add('hidden');
                        resetExtractButton();
                        return;
                    }
                } catch (error) {
                    showNotification('Error decrypting watermark. Incorrect password?', 'error');
                    document.getElementById('extractedResult').classList.add('hidden');
                    resetExtractButton();
                    return;
                }

                if (progressBar) progressBar.style.width = '100%';
                if (progressText) progressText.textContent = 'Complete!';

                // Display extracted message (encrypted)
                if (message && message.trim()) {
                    document.getElementById('extractedText').textContent = message;
                    document.getElementById('extractedResult').classList.remove('hidden');
                    showNotification('Watermark extracted and decrypted successfully!', 'success');
                    if (typeof showToast === 'function') showToast('Watermark decrypted successfully!', 'success');
                } else {
                    document.getElementById('extractedResult').classList.add('hidden');
                    showNotification('No valid watermark found in this image!', 'error');
                }
            } else {
                if (progressBar) progressBar.style.width = '100%';
                if (progressText) progressText.textContent = 'Complete!';

                // Display extracted message (unencrypted)
                if (message.trim()) {
                    document.getElementById('extractedText').textContent = message;
                    document.getElementById('extractedResult').classList.remove('hidden');
                    showNotification('Watermark extracted successfully!', 'success');
                    if (typeof showToast === 'function') showToast('Watermark extracted successfully!', 'success');
                } else {
                    document.getElementById('extractedResult').classList.add('hidden');
                    showNotification('No valid watermark found in this image!', 'error');
                }
            }

            // Hide progress after a short delay
            setTimeout(() => {
                if (progressContainer) progressContainer.style.display = 'none';
                if (progressText) progressText.textContent = '';
            }, 1500);

        } catch (error) {
            showNotification('Error extracting watermark. The image may not contain a valid watermark.', 'error');
            document.getElementById('extractedResult').classList.add('hidden');
        } finally {
            resetExtractButton();
        }
    };
    
    img.onerror = function() {
        showNotification('Error loading image. Please try a different image.', 'error');
        resetExtractButton();
    };
    
    img.src = watermarkedImageData;
}

// Helper function to reset extract button state
function resetExtractButton() {
    const btn = document.getElementById('extractBtn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoading = btn.querySelector('.btn-loading');
    const progressContainer = document.getElementById('extractProgress');

    btn.disabled = false;
    if (btnText && btnLoading) {
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
    }
    if (progressContainer) {
        progressContainer.style.display = 'none';
    }
}

