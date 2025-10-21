/**
 * Tests for Error Middleware
 */

import { errorHandler, notFoundHandler } from '../../../middleware/error.middleware';
import { mockRequest, mockResponse, mockNext } from '../../mocks/mockData';
import { HTTP_STATUS } from '../../../constants/httpStatus';
import { ERROR_MESSAGES } from '../../../constants/messages';

describe('Error Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('errorHandler', () => {
    it('should handle Mongoose validation errors', () => {
      const req = mockRequest();
      const res = mockResponse();
      const err = {
        name: 'ValidationError',
        errors: {
          email: { message: 'Email is required' },
          password: { message: 'Password is required' },
        },
      };

      errorHandler(err, req as any, res as any, mockNext as any);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: ERROR_MESSAGES.VALIDATION_FAILED,
        })
      );
    });

    it('should handle Mongoose duplicate key errors', () => {
      const req = mockRequest();
      const res = mockResponse();
      const err = {
        code: 11000,
        keyPattern: { email: 1 },
      };

      errorHandler(err, req as any, res as any, mockNext as any);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'email already exists',
        })
      );
    });

    it('should handle Mongoose cast errors', () => {
      const req = mockRequest();
      const res = mockResponse();
      const err = {
        name: 'CastError',
      };

      errorHandler(err, req as any, res as any, mockNext as any);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid ID format',
        })
      );
    });

    it('should handle JWT errors', () => {
      const req = mockRequest();
      const res = mockResponse();
      const err = {
        name: 'JsonWebTokenError',
      };

      errorHandler(err, req as any, res as any, mockNext as any);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: ERROR_MESSAGES.INVALID_TOKEN,
        })
      );
    });

    it('should handle token expired errors', () => {
      const req = mockRequest();
      const res = mockResponse();
      const err = {
        name: 'TokenExpiredError',
      };

      errorHandler(err, req as any, res as any, mockNext as any);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
    });

    it('should handle generic errors', () => {
      const req = mockRequest();
      const res = mockResponse();
      const err = {
        message: 'Something went wrong',
      };

      errorHandler(err, req as any, res as any, mockNext as any);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });

    it('should use custom status code if provided', () => {
      const req = mockRequest();
      const res = mockResponse();
      const err = {
        statusCode: HTTP_STATUS.FORBIDDEN,
        message: 'Forbidden',
      };

      errorHandler(err, req as any, res as any, mockNext as any);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.FORBIDDEN);
    });
  });

  describe('notFoundHandler', () => {
    it('should return 404 for not found routes', () => {
      const req = mockRequest();
      req.originalUrl = '/api/non-existent';
      const res = mockResponse();

      notFoundHandler(req as any, res as any, mockNext as any);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          code: HTTP_STATUS.NOT_FOUND,
          message: 'Route /api/non-existent not found',
        })
      );
    });
  });
});
