/**
 * Tests for Message Constants
 */

import {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  VALIDATION_MESSAGES,
  INFO_MESSAGES,
} from '../../../constants/messages';

describe('Message Constants', () => {
  describe('SUCCESS_MESSAGES', () => {
    it('should have user registration message', () => {
      expect(SUCCESS_MESSAGES.USER_REGISTERED).toBeDefined();
      expect(typeof SUCCESS_MESSAGES.USER_REGISTERED).toBe('string');
    });

    it('should have OTP messages', () => {
      expect(SUCCESS_MESSAGES.OTP_GENERATED).toBeDefined();
      expect(SUCCESS_MESSAGES.OTP_VERIFIED).toBeDefined();
      expect(SUCCESS_MESSAGES.OTP_SENT).toBeDefined();
    });

    it('should have password reset messages', () => {
      expect(SUCCESS_MESSAGES.PASSWORD_RESET_REQUESTED).toBeDefined();
      expect(SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS).toBeDefined();
    });
  });

  describe('ERROR_MESSAGES', () => {
    it('should have authentication error messages', () => {
      expect(ERROR_MESSAGES.INVALID_CREDENTIALS).toBeDefined();
      expect(ERROR_MESSAGES.INVALID_TOKEN).toBeDefined();
      expect(ERROR_MESSAGES.UNAUTHORIZED).toBeDefined();
      expect(ERROR_MESSAGES.TOKEN_REQUIRED).toBeDefined();
    });

    it('should have user error messages', () => {
      expect(ERROR_MESSAGES.USER_NOT_FOUND).toBeDefined();
      expect(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS).toBeDefined();
    });

    it('should have OTP error messages', () => {
      expect(ERROR_MESSAGES.INVALID_OTP).toBeDefined();
      expect(ERROR_MESSAGES.OTP_EXPIRED).toBeDefined();
      expect(ERROR_MESSAGES.OTP_NOT_FOUND).toBeDefined();
    });

    it('should have validation error messages', () => {
      expect(ERROR_MESSAGES.VALIDATION_FAILED).toBeDefined();
      expect(ERROR_MESSAGES.INVALID_INPUT).toBeDefined();
    });
  });

  describe('VALIDATION_MESSAGES', () => {
    it('should have email validation messages', () => {
      expect(VALIDATION_MESSAGES.EMAIL_REQUIRED).toBeDefined();
      expect(VALIDATION_MESSAGES.EMAIL_INVALID).toBeDefined();
    });

    it('should have password validation messages', () => {
      expect(VALIDATION_MESSAGES.PASSWORD_REQUIRED).toBeDefined();
      expect(VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH).toBeDefined();
      expect(VALIDATION_MESSAGES.PASSWORD_MUST_CONTAIN_NUMBER).toBeDefined();
    });

    it('should have OTP validation messages', () => {
      expect(VALIDATION_MESSAGES.OTP_REQUIRED).toBeDefined();
      expect(VALIDATION_MESSAGES.OTP_INVALID).toBeDefined();
    });

    it('should have profile field validation messages', () => {
      expect(VALIDATION_MESSAGES.PHONE_LENGTH).toBeDefined();
      expect(VALIDATION_MESSAGES.ADDRESS_MAX_LENGTH).toBeDefined();
      expect(VALIDATION_MESSAGES.COUNTRY_MAX_LENGTH).toBeDefined();
    });
  });

  describe('INFO_MESSAGES', () => {
    it('should have API information', () => {
      expect(INFO_MESSAGES.API_NAME).toBe('Node.js TypeScript REST API Boilerplate');
      expect(INFO_MESSAGES.API_VERSION).toBe('1.0.0');
    });

    it('should have server messages', () => {
      expect(INFO_MESSAGES.SERVER_STARTED).toBeDefined();
      expect(INFO_MESSAGES.DATABASE_CONNECTED).toBeDefined();
    });
  });

  describe('Message completeness', () => {
    it('should have all message categories defined', () => {
      expect(SUCCESS_MESSAGES).toBeDefined();
      expect(ERROR_MESSAGES).toBeDefined();
      expect(VALIDATION_MESSAGES).toBeDefined();
      expect(INFO_MESSAGES).toBeDefined();

      // Verify all messages are strings
      Object.values(SUCCESS_MESSAGES).forEach((msg) => {
        expect(typeof msg).toBe('string');
      });
    });
  });
});
