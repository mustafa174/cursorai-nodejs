/**
 * Generates a 6-digit OTP code
 * @returns {string} A 6-digit OTP string
 */
export const generateOTP = (): string => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};

/**
 * Generates a random token for password reset
 * @returns {string} A random token string
 */
export const generateResetToken = (): string => {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
};

