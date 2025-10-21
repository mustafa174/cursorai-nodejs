/**
 * Tests for Generate OTP Utility
 */

import { generateOTP, generateResetToken } from '../../../utils/generateOTP';

describe('Generate OTP Utility', () => {
  describe('generateOTP', () => {
    it('should generate a 6-digit OTP', () => {
      const otp = generateOTP();

      expect(otp).toHaveLength(6);
      expect(/^\d{6}$/.test(otp)).toBe(true);
    });

    it('should generate different OTPs on subsequent calls', () => {
      const otp1 = generateOTP();
      const otp2 = generateOTP();

      // While there's a tiny chance they could be the same, it's very unlikely
      expect(otp1).not.toBe(otp2);
    });

    it('should generate OTP with only numeric characters', () => {
      const otp = generateOTP();

      expect(Number(otp)).not.toBeNaN();
      expect(parseInt(otp, 10)).toBeGreaterThanOrEqual(0);
      expect(parseInt(otp, 10)).toBeLessThan(1000000);
    });
  });

  describe('generateResetToken', () => {
    it('should generate a reset token', () => {
      const token = generateResetToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should generate different tokens on subsequent calls', () => {
      const token1 = generateResetToken();
      const token2 = generateResetToken();

      expect(token1).not.toBe(token2);
    });

    it('should generate hexadecimal token', () => {
      const token = generateResetToken();

      expect(/^[a-f0-9]+$/.test(token)).toBe(true);
    });
  });
});
