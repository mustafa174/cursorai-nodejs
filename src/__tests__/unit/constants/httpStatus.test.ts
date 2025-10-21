/**
 * Tests for HTTP Status Constants
 */

import { HTTP_STATUS } from '../../../constants/httpStatus';

describe('HTTP Status Constants', () => {
  it('should have success status codes', () => {
    expect(HTTP_STATUS.OK).toBe(200);
    expect(HTTP_STATUS.CREATED).toBe(201);
    expect(HTTP_STATUS.ACCEPTED).toBe(202);
    expect(HTTP_STATUS.NO_CONTENT).toBe(204);
  });

  it('should have client error status codes', () => {
    expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
    expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
    expect(HTTP_STATUS.FORBIDDEN).toBe(403);
    expect(HTTP_STATUS.NOT_FOUND).toBe(404);
    expect(HTTP_STATUS.METHOD_NOT_ALLOWED).toBe(405);
    expect(HTTP_STATUS.CONFLICT).toBe(409);
    expect(HTTP_STATUS.UNPROCESSABLE_ENTITY).toBe(422);
    expect(HTTP_STATUS.TOO_MANY_REQUESTS).toBe(429);
  });

  it('should have server error status codes', () => {
    expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
    expect(HTTP_STATUS.NOT_IMPLEMENTED).toBe(501);
    expect(HTTP_STATUS.BAD_GATEWAY).toBe(502);
    expect(HTTP_STATUS.SERVICE_UNAVAILABLE).toBe(503);
  });

  it('should have all status codes defined', () => {
    // Verify all status codes are numbers
    Object.values(HTTP_STATUS).forEach((code) => {
      expect(typeof code).toBe('number');
    });
  });
});
