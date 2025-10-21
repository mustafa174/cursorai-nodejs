import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';
import { ERROR_MESSAGES } from '../constants/messages';

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e: any) => e.message);
    return sendError(res, HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.VALIDATION_FAILED, errors);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return sendError(res, HTTP_STATUS.BAD_REQUEST, `${field} already exists`);
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid ID format');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN);
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Token has expired');
  }

  // Default error
  return sendError(
    res,
    err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR,
    err.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR
  );
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response, _next: NextFunction): Response => {
  return sendError(res, HTTP_STATUS.NOT_FOUND, `Route ${req.originalUrl} not found`);
};
