import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { sendError } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';
import { ERROR_MESSAGES } from '../constants/messages';

/**
 * Authentication middleware to protect routes
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    // Get token from header
    const authHeader = (req as any).headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.TOKEN_REQUIRED);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = authService.verifyToken(token);

    // Get user from token
    const user = await authService.getUserById(decoded.userId);

    if (!user) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Attach user to request
    (req as any).user = user;

    (next as any)();
  } catch (error: any) {
    console.error('Authentication error:', error);
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN);
  }
};

/**
 * Middleware to check if email is verified
 */
export const requireEmailVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const user = (req as any).user;

    if (!user) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
    }

    if (!user.isEmailVerified) {
      return sendError(
        res,
        HTTP_STATUS.FORBIDDEN,
        'Please verify your email to access this resource'
      );
    }

    (next as any)();
  } catch (error: any) {
    console.error('Email verification check error:', error);
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Failed to verify email status');
  }
};
