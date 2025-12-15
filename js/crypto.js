// Encryption/Decryption utilities for watermark security

// Simple XOR-based encryption with hash
class WatermarkCrypto {
    static async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    static generateSalt(length = 16) {
        return Array.from(crypto.getRandomValues(new Uint8Array(length)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    static async encryptWatermark(watermarkText, password) {
        if (!password || password.trim() === '') {
            // No encryption
            return {
                encrypted: watermarkText,
                salt: null,
                isEncrypted: false
            };
        }

        const salt = this.generateSalt();
        const passwordHash = await this.hashPassword(password + salt);
        
        // Add a checksum marker at the start to verify correct decryption
        const textWithChecksum = '||VALID||' + watermarkText;
        
        // Simple XOR encryption with password hash
        let encrypted = '';
        for (let i = 0; i < textWithChecksum.length; i++) {
            const charCode = textWithChecksum.charCodeAt(i);
            const keyCode = passwordHash.charCodeAt(i % passwordHash.length);
            encrypted += String.fromCharCode(charCode ^ keyCode);
        }

        // Encode to hex to preserve binary data
        const encryptedHex = Array.from(encrypted)
            .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('');

        return {
            encrypted: encryptedHex,
            salt: salt,
            isEncrypted: true
        };
    }

    static async decryptWatermark(encryptedHex, password, salt) {
        if (!salt || !password || password.trim() === '') {
            // Not encrypted
            return encryptedHex;
        }

        try {
            const passwordHash = await this.hashPassword(password + salt);
            
            // Convert hex back to string
            let encrypted = '';
            for (let i = 0; i < encryptedHex.length; i += 2) {
                encrypted += String.fromCharCode(parseInt(encryptedHex.substr(i, 2), 16));
            }

            // XOR decryption
            let decrypted = '';
            for (let i = 0; i < encrypted.length; i++) {
                const charCode = encrypted.charCodeAt(i);
                const keyCode = passwordHash.charCodeAt(i % passwordHash.length);
                decrypted += String.fromCharCode(charCode ^ keyCode);
            }

            // Check for the checksum marker - if not present, password is wrong
            if (!decrypted.startsWith('||VALID||')) {
                return null; // Wrong password
            }

            // Remove the checksum marker and return the actual message
            return decrypted.substring(9); // Remove '||VALID||'
        } catch (error) {
            console.error('Decryption error:', error);
            return null;
        }
    }
}
