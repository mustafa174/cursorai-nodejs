/**
 * Tests for Validation Middleware
 */

import { mockRequest, mockResponse, mockNext } from '../../mocks/mockData';
import { HTTP_STATUS } from '../../../constants/httpStatus';
import { ERROR_MESSAGES } from '../../../constants/messages';

// Mock express-validator before importing validation middleware
jest.mock('express-validator', () => ({
  body: jest.fn(() => ({
    optional: jest.fn().mockReturnThis(),
    isString: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis(),
    trim: jest.fn().mockReturnThis(),
    isLength: jest.fn().mockReturnThis(),
    matches: jest.fn().mockReturnThis(),
    isEmail: jest.fn().mockReturnThis(),
    normalizeEmail: jest.fn().mockReturnThis(),
    notEmpty: jest.fn().mockReturnThis(),
    isNumeric: jest.fn().mockReturnThis(),
    isMongoId: jest.fn().mockReturnThis(),
  })),
  validationResult: jest.fn(),
}));

const { validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../../middleware/validation.middleware');

describe('Validation Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleValidationErrors', () => {
    it('should call next() if no validation errors', () => {
      const req = mockRequest();
      const res = mockResponse();

      (validationResult as any).mockReturnValue({
        isEmpty: () => true,
        array: () => [],
      });

      handleValidationErrors(req as any, res as any, mockNext as any);

      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return errors if validation fails', () => {
      const req = mockRequest();
      const res = mockResponse();
      const errors = [
        { param: 'email', msg: 'Invalid email' },
        { param: 'password', msg: 'Password too short' },
      ];

      (validationResult as any).mockReturnValue({
        isEmpty: () => false,
        array: () => errors,
      });

      handleValidationErrors(req as any, res as any, mockNext as any);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          code: HTTP_STATUS.BAD_REQUEST,
          message: ERROR_MESSAGES.VALIDATION_FAILED,
          error: errors,
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
