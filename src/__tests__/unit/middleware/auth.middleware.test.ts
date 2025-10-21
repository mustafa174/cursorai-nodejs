/**
 * Tests for Auth Middleware
 */

import { authenticate, requireEmailVerification } from '../../../middleware/auth.middleware';
import authService from '../../../services/auth.service';
import { mockRequest, mockResponse, mockNext, mockUser, mockToken } from '../../mocks/mockData';
import { HTTP_STATUS } from '../../../constants/httpStatus';
import { ERROR_MESSAGES } from '../../../constants/messages';

// Mock dependencies
jest.mock('../../../services/auth.service');

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should authenticate user with valid token', async () => {
      const req = mockRequest({}, {}, { authorization: `Bearer ${mockToken}` });
      const res = mockResponse();

      (authService.verifyToken as jest.Mock).mockReturnValue({ userId: mockUser._id });
      (authService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      await authenticate(req as any, res as any, mockNext as any);

      expect(authService.verifyToken).toHaveBeenCalledWith(mockToken);
      expect(authService.getUserById).toHaveBeenCalledWith(mockUser._id);
      expect(req.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should reject request without token', async () => {
      const req = mockRequest();
      const res = mockResponse();

      await authenticate(req as any, res as any, mockNext as any);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: ERROR_MESSAGES.TOKEN_REQUIRED,
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token', async () => {
      const req = mockRequest({}, {}, { authorization: 'Bearer invalid-token' });
      const res = mockResponse();

      (authService.verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authenticate(req as any, res as any, mockNext as any);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject if user not found', async () => {
      const req = mockRequest({}, {}, { authorization: `Bearer ${mockToken}` });
      const res = mockResponse();

      (authService.verifyToken as jest.Mock).mockReturnValue({ userId: 'non-existent' });
      (authService.getUserById as jest.Mock).mockResolvedValue(null);

      await authenticate(req as any, res as any, mockNext as any);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: ERROR_MESSAGES.USER_NOT_FOUND,
        })
      );
    });
  });

  describe('requireEmailVerification', () => {
    it('should allow verified users', async () => {
      const req = mockRequest();
      (req as any).user = { ...mockUser, isEmailVerified: true };
      const res = mockResponse();

      await requireEmailVerification(req as any, res as any, mockNext as any);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should reject unverified users', async () => {
      const req = mockRequest();
      (req as any).user = { ...mockUser, isEmailVerified: false };
      const res = mockResponse();

      await requireEmailVerification(req as any, res as any, mockNext as any);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.FORBIDDEN);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject if no user in request', async () => {
      const req = mockRequest();
      const res = mockResponse();

      await requireEmailVerification(req as any, res as any, mockNext as any);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
    });
  });
});
