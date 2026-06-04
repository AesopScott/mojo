/**
 * encryption.js — AES-256-GCM encryption/decryption for sensitive seller data
 *
 * Usage:
 *   const encrypted = encryptBankDetails({ accountNumber: '...', routingNumber: '...' }, key);
 *   const decrypted = decryptBankDetails(encrypted, key);
 *
 * The encryption key should be a 32-byte Buffer (256-bit).
 * Environment: SELLER_ENCRYPTION_KEY (base64 encoded)
 */

'use strict';

const crypto = require('crypto');

/**
 * Encrypt bank details using AES-256-GCM
 * @param {Object} bankDetails - { accountNumber, routingNumber, accountHolder, bankName }
 * @param {Buffer} encryptionKey - 32-byte encryption key
 * @returns {string} base64-encoded encrypted data (includes IV + auth tag + ciphertext)
 */
function encryptBankDetails(bankDetails, encryptionKey) {
  if (!bankDetails || typeof bankDetails !== 'object') {
    throw new Error('bankDetails must be an object');
  }

  if (!encryptionKey || encryptionKey.length !== 32) {
    throw new Error('encryptionKey must be 32 bytes (256-bit)');
  }

  // Generate random IV (96 bits for GCM is standard)
  const iv = crypto.randomBytes(12);

  // Serialize bank details to JSON
  const plaintext = JSON.stringify(bankDetails);

  // Create cipher
  const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv);

  // Encrypt
  let encrypted = cipher.update(plaintext, 'utf8', 'binary');
  encrypted += cipher.final('binary');

  // Get authentication tag
  const authTag = cipher.getAuthTag();

  // Combine: IV + authTag + encrypted data
  const combined = Buffer.concat([iv, authTag, Buffer.from(encrypted, 'binary')]);

  // Return as base64 for storage
  return combined.toString('base64');
}

/**
 * Decrypt bank details using AES-256-GCM
 * @param {string} encryptedData - base64-encoded encrypted data
 * @param {Buffer} encryptionKey - 32-byte encryption key
 * @returns {Object} decrypted bank details
 */
function decryptBankDetails(encryptedData, encryptionKey) {
  if (!encryptedData || typeof encryptedData !== 'string') {
    throw new Error('encryptedData must be a base64 string');
  }

  if (!encryptionKey || encryptionKey.length !== 32) {
    throw new Error('encryptionKey must be 32 bytes (256-bit)');
  }

  try {
    // Decode from base64
    const combined = Buffer.from(encryptedData, 'base64');

    // Extract components (IV: 12 bytes, authTag: 16 bytes, rest: ciphertext)
    const iv = combined.slice(0, 12);
    const authTag = combined.slice(12, 28);
    const ciphertext = combined.slice(28);

    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey, iv);
    decipher.setAuthTag(authTag);

    // Decrypt
    let decrypted = decipher.update(ciphertext, 'binary', 'utf8');
    decrypted += decipher.final('utf8');

    // Parse JSON
    return JSON.parse(decrypted);
  } catch (err) {
    throw new Error(`Decryption failed: ${err.message}`);
  }
}

/**
 * Generate a 32-byte encryption key from a string (for testing only)
 * For production, use crypto.randomBytes(32) or env var
 */
function generateKeyFromString(str) {
  return crypto.createHash('sha256').update(str).digest();
}

module.exports = {
  encryptBankDetails,
  decryptBankDetails,
  generateKeyFromString,
};
