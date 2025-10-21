/**
 * Tests for Auth Service
 */

import authService from '../../../services/auth.service';
import User from '../../../models/User.model';
import { mockUser, mockUserInput, mockSigninData, mockOTP } from '../../mocks/mockData';
import { ERROR_MESSAGES } from '../../../constants/messages';

// Mock dependencies
jest.mock('../../../models/User.model');
jest.mock('../../../utils/email');
jest.mock('../../../utils/generateOTP');
jest.mock('jsonwebtoken');

const jwt = require('jsonwebtoken');
const emailService = require('../../../utils/email');
const { generateOTP, generateResetToken } = require('../../../utils/generateOTP');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should create a new user successfully', async () => {
      const mockSave = jest.fn().mockResolvedValue(mockUser);
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User as any).mockImplementation(() => ({
        ...mockUser,
        save: mockSave,
      }));

      generateOTP.mockReturnValue(mockOTP);
      jwt.sign.mockReturnValue('mock-token');
      emailService.default.sendOTPEmail = jest.fn().mockResolvedValue(true);

      const result = await authService.signup(mockUserInput);

      expect(User.findOne).toHaveBeenCalledWith({ email: mockUserInput.email });
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
    });

    it('should throw error if email already exists', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(authService.signup(mockUserInput)).rejects.toThrow(
        ERROR_MESSAGES.EMAIL_ALREADY_EXISTS
      );
    });
  });

  describe('signin', () => {
    it('should generate OTP for valid credentials', async () => {
      const mockUserWithPassword = {
        ...mockUser,
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true),
      };

      (User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUserWithPassword),
      });

      generateOTP.mockReturnValue(mockOTP);
      emailService.default.sendOTPEmail = jest.fn().mockResolvedValue(true);

      const result = await authService.signin(mockSigninData);

      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('otp');
      expect(result.otp).toBe(mockOTP);
    });

    it('should throw error for invalid email', async () => {
      (User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await expect(authService.signin(mockSigninData)).rejects.toThrow(
        ERROR_MESSAGES.INVALID_CREDENTIALS
      );
    });

    it('should throw error for invalid password', async () => {
      const mockUserWithPassword = {
        ...mockUser,
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      (User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUserWithPassword),
      });

      await expect(authService.signin(mockSigninData)).rejects.toThrow(
        ERROR_MESSAGES.INVALID_CREDENTIALS
      );
    });
  });

  describe('verifyOTP', () => {
    it('should verify OTP and return token', async () => {
      const mockUserWithOTP = {
        ...mockUser,
        otp: mockOTP,
        otpExpires: new Date(Date.now() + 10000),
        save: jest.fn().mockResolvedValue(true),
      };

      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUserWithOTP),
      });

      jwt.sign.mockReturnValue('mock-token');
      emailService.default.sendWelcomeEmail = jest.fn().mockResolvedValue(true);

      const result = await authService.verifyOTP('user-id', mockOTP);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
    });

    it('should throw error for invalid OTP', async () => {
      const mockUserWithOTP = {
        ...mockUser,
        otp: '654321',
        otpExpires: new Date(Date.now() + 10000),
      };

      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUserWithOTP),
      });

      await expect(authService.verifyOTP('user-id', mockOTP)).rejects.toThrow(
        ERROR_MESSAGES.INVALID_OTP
      );
    });

    it('should throw error for expired OTP', async () => {
      const mockUserWithOTP = {
        ...mockUser,
        otp: mockOTP,
        otpExpires: new Date(Date.now() - 10000),
      };

      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUserWithOTP),
      });

      await expect(authService.verifyOTP('user-id', mockOTP)).rejects.toThrow(
        ERROR_MESSAGES.OTP_EXPIRED
      );
    });
  });

  describe('requestPasswordReset', () => {
    it('should generate reset token for valid email', async () => {
      const mockUserData = {
        ...mockUser,
        save: jest.fn().mockResolvedValue(true),
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUserData);
      generateResetToken.mockReturnValue('reset-token');
      emailService.default.sendPasswordResetEmail = jest.fn().mockResolvedValue(true);

      await authService.requestPasswordReset(mockUser.email);

      expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
      expect(mockUserData.save).toHaveBeenCalled();
    });

    it('should not throw error for non-existent email (security)', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.requestPasswordReset('nonexistent@example.com')
      ).resolves.not.toThrow();
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      const mockUserData = {
        ...mockUser,
        save: jest.fn().mockResolvedValue(true),
      };

      (User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUserData),
      });

      await authService.resetPassword('valid-token', 'newPassword123');

      expect(mockUserData.save).toHaveBeenCalled();
    });

    it('should throw error for invalid token', async () => {
      (User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await expect(authService.resetPassword('invalid-token', 'newPassword123')).rejects.toThrow(
        ERROR_MESSAGES.INVALID_TOKEN
      );
    });
  });

  describe('getUserById', () => {
    it('should return user by ID', async () => {
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.getUserById('user-id');

      expect(result).toEqual(mockUser);
      expect(User.findById).toHaveBeenCalledWith('user-id');
    });

    it('should return null for non-existent user', async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      const result = await authService.getUserById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', () => {
      const payload = { userId: 'user-id' };
      jwt.verify.mockReturnValue(payload);

      const result = authService.verifyToken('valid-token');

      expect(result).toEqual(payload);
    });

    it('should throw error for invalid token', () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => authService.verifyToken('invalid-token')).toThrow(ERROR_MESSAGES.INVALID_TOKEN);
    });
  });
});
