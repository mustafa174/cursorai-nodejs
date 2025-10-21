/**
 * Tests for Auth Controller
 */

import authController from '../../../controllers/auth.controller';
import authService from '../../../services/auth.service';
import {
  mockRequest,
  mockResponse,
  mockUser,
  mockUserInput,
  mockToken,
  mockOTP,
  mockFile,
} from '../../mocks/mockData';
import { HTTP_STATUS } from '../../../constants/httpStatus';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../../constants/messages';

// Mock dependencies
jest.mock('../../../services/auth.service');

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should register user successfully', async () => {
      const req = mockRequest(mockUserInput);
      const res = mockResponse();

      (authService.signup as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      await authController.signup(req as any, res as any);

      expect(authService.signup).toHaveBeenCalledWith(mockUserInput);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          code: HTTP_STATUS.CREATED,
          message: SUCCESS_MESSAGES.USER_REGISTERED,
        })
      );
    });

    it('should handle missing required fields', async () => {
      const req = mockRequest({ name: 'Test' }); // Missing email and password
      const res = mockResponse();

      await authController.signup(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: ERROR_MESSAGES.REQUIRED_FIELDS_MISSING,
        })
      );
    });

    it('should handle signup with display picture', async () => {
      const req = mockRequest(mockUserInput);
      req.file = mockFile as any;
      const res = mockResponse();

      (authService.signup as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      await authController.signup(req as any, res as any);

      expect(authService.signup).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockUserInput,
          displayPicture: expect.objectContaining({
            data: expect.any(Buffer),
            contentType: 'image/jpeg',
          }),
        })
      );
    });

    it('should handle service errors', async () => {
      const req = mockRequest(mockUserInput);
      const res = mockResponse();

      (authService.signup as jest.Mock).mockRejectedValue(
        new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS)
      );

      await authController.signup(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    });
  });

  describe('signin', () => {
    it('should sign in user and return OTP', async () => {
      const req = mockRequest({ email: 'test@example.com', password: 'password123' });
      const res = mockResponse();

      (authService.signin as jest.Mock).mockResolvedValue({
        userId: mockUser._id,
        otp: mockOTP,
      });

      await authController.signin(req as any, res as any);

      expect(authService.signin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: SUCCESS_MESSAGES.OTP_GENERATED,
        })
      );
    });

    it('should handle missing credentials', async () => {
      const req = mockRequest({ email: 'test@example.com' }); // Missing password
      const res = mockResponse();

      await authController.signin(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    });

    it('should handle invalid credentials', async () => {
      const req = mockRequest({ email: 'test@example.com', password: 'wrong' });
      const res = mockResponse();

      (authService.signin as jest.Mock).mockRejectedValue(
        new Error(ERROR_MESSAGES.INVALID_CREDENTIALS)
      );

      await authController.signin(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
    });
  });

  describe('verifyOTP', () => {
    it('should verify OTP and return token', async () => {
      const req = mockRequest({ userId: mockUser._id, otp: mockOTP });
      const res = mockResponse();

      (authService.verifyOTP as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      await authController.verifyOTP(req as any, res as any);

      expect(authService.verifyOTP).toHaveBeenCalledWith(mockUser._id, mockOTP);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: SUCCESS_MESSAGES.OTP_VERIFIED,
        })
      );
    });

    it('should handle invalid OTP', async () => {
      const req = mockRequest({ userId: mockUser._id, otp: '000000' });
      const res = mockResponse();

      (authService.verifyOTP as jest.Mock).mockRejectedValue(new Error(ERROR_MESSAGES.INVALID_OTP));

      await authController.verifyOTP(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    });
  });

  describe('forgotPassword', () => {
    it('should send password reset email', async () => {
      const req = mockRequest({ email: 'test@example.com' });
      const res = mockResponse();

      (authService.requestPasswordReset as jest.Mock).mockResolvedValue(undefined);

      await authController.forgotPassword(req as any, res as any);

      expect(authService.requestPasswordReset).toHaveBeenCalledWith('test@example.com');
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      const req = mockRequest({ token: 'reset-token', newPassword: 'newPassword123' });
      const res = mockResponse();

      (authService.resetPassword as jest.Mock).mockResolvedValue(undefined);

      await authController.resetPassword(req as any, res as any);

      expect(authService.resetPassword).toHaveBeenCalledWith('reset-token', 'newPassword123');
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS,
        })
      );
    });

    it('should reject short passwords', async () => {
      const req = mockRequest({ token: 'reset-token', newPassword: '12345' });
      const res = mockResponse();

      await authController.resetPassword(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    });
  });

  describe('generateOTP', () => {
    it('should generate and send OTP', async () => {
      const req = mockRequest({ email: 'test@example.com' });
      const res = mockResponse();

      (authService.generateOTP as jest.Mock).mockResolvedValue(undefined);

      await authController.generateOTP(req as any, res as any);

      expect(authService.generateOTP).toHaveBeenCalledWith('test@example.com');
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    });
  });

  describe('getDisplayPicture', () => {
    it('should return display picture', async () => {
      const req = mockRequest({}, { userId: mockUser._id });
      const res = mockResponse();

      const mockUserWithPicture = {
        ...mockUser,
        displayPicture: {
          data: Buffer.from('test'),
          contentType: 'image/jpeg',
        },
      };

      (authService.getUserById as jest.Mock).mockResolvedValue(mockUserWithPicture);

      await authController.getDisplayPicture(req as any, res as any);

      expect(res.contentType).toHaveBeenCalledWith('image/jpeg');
      expect(res.send).toHaveBeenCalledWith(mockUserWithPicture.displayPicture.data);
    });

    it('should return 404 if picture not found', async () => {
      const req = mockRequest({}, { userId: mockUser._id });
      const res = mockResponse();

      (authService.getUserById as jest.Mock).mockResolvedValue(null);

      await authController.getDisplayPicture(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
    });
  });
});
