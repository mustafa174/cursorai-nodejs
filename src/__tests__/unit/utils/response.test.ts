/**
 * Tests for Response Utility
 */

import { sendSuccess, sendError } from '../../../utils/response';
import { mockResponse } from '../../mocks/mockData';

describe('Response Utility', () => {
  describe('sendSuccess', () => {
    it('should send success response with data', () => {
      const res = mockResponse();
      const data = { user: { name: 'Test' } };

      sendSuccess(res, 200, 'Success message', data);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        code: 200,
        message: 'Success message',
        data,
      });
    });

    it('should send success response without data', () => {
      const res = mockResponse();

      sendSuccess(res, 200, 'Success message');

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        code: 200,
        message: 'Success message',
      });
    });

    it('should add count for array data', () => {
      const res = mockResponse();
      const data = [{ id: 1 }, { id: 2 }, { id: 3 }];

      sendSuccess(res, 200, 'Success', data);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        code: 200,
        message: 'Success',
        data,
        count: 3,
      });
    });

    it('should add pagination when provided', () => {
      const res = mockResponse();
      const data = [{ id: 1 }];
      const paginationOptions = { page: 1, limit: 10, totalItems: 100 };

      sendSuccess(res, 200, 'Success', data, paginationOptions);

      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall).toHaveProperty('pagination');
      expect(jsonCall.pagination).toMatchObject({
        page: 1,
        limit: 10,
        totalItems: 100,
        totalPages: 10,
        hasNextPage: true,
        hasPrevPage: false,
      });
    });
  });

  describe('sendError', () => {
    it('should send error response with message', () => {
      const res = mockResponse();

      sendError(res, 400, 'Error message');

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        code: 400,
        message: 'Error message',
      });
    });

    it('should send error response with error details', () => {
      const res = mockResponse();
      const errorDetails = { field: 'email', message: 'Invalid email' };

      sendError(res, 400, 'Validation error', errorDetails);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        code: 400,
        message: 'Validation error',
        error: errorDetails,
      });
    });
  });
});
