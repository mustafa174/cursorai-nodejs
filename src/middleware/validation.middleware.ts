import { Request, Response, NextFunction } from 'express';
import { validationResult, body } from 'express-validator';
import { sendError } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';
import { ERROR_MESSAGES, VALIDATION_MESSAGES } from '../constants/messages';

/**
 * Validation result handler
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return sendError(
      res,
      HTTP_STATUS.BAD_REQUEST,
      ERROR_MESSAGES.VALIDATION_FAILED,
      errors.array()
    );
  }

  (next as any)();
};

/**
 * Optional profile fields validation rules
 * Can be used standalone or combined with other validation rules
 * Note: displayPicture validation is handled by multer middleware
 */
export const profileFieldsValidation = [
  // Phone validation
  body('phone')
    .optional()
    .isString()
    .withMessage(VALIDATION_MESSAGES.PHONE_INVALID)
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage(VALIDATION_MESSAGES.PHONE_LENGTH)
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage(VALIDATION_MESSAGES.PHONE_FORMAT),

  // Address validation
  body('address')
    .optional()
    .isString()
    .withMessage(VALIDATION_MESSAGES.ADDRESS_INVALID)
    .trim()
    .isLength({ max: 200 })
    .withMessage(VALIDATION_MESSAGES.ADDRESS_MAX_LENGTH),

  // Country validation
  body('country')
    .optional()
    .isString()
    .withMessage(VALIDATION_MESSAGES.COUNTRY_INVALID)
    .trim()
    .isLength({ max: 100 })
    .withMessage(VALIDATION_MESSAGES.COUNTRY_MAX_LENGTH)
    .matches(/^[a-zA-Z\s-]+$/)
    .withMessage(VALIDATION_MESSAGES.COUNTRY_FORMAT),
];

/**
 * Signup validation rules
 */
export const signupValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage(VALIDATION_MESSAGES.NAME_MIN_LENGTH),
  body('email').trim().isEmail().normalizeEmail().withMessage(VALIDATION_MESSAGES.EMAIL_INVALID),
  body('password')
    .isLength({ min: 6 })
    .withMessage(VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH)
    .matches(/\d/)
    .withMessage(VALIDATION_MESSAGES.PASSWORD_MUST_CONTAIN_NUMBER),

  // Optional fields (include profile fields validation)
  ...profileFieldsValidation,
];

/**
 * Signin validation rules
 */
export const signinValidation = [
  body('email').trim().isEmail().normalizeEmail().withMessage(VALIDATION_MESSAGES.EMAIL_INVALID),
  body('password').notEmpty().withMessage(VALIDATION_MESSAGES.PASSWORD_REQUIRED),
];

/**
 * Email validation rules
 */
export const emailValidation = [
  body('email').trim().isEmail().normalizeEmail().withMessage(VALIDATION_MESSAGES.EMAIL_INVALID),
];

/**
 * Password reset validation rules
 */
export const resetPasswordValidation = [
  body('token').notEmpty().withMessage(VALIDATION_MESSAGES.TOKEN_REQUIRED),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage(VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH)
    .matches(/\d/)
    .withMessage(VALIDATION_MESSAGES.PASSWORD_MUST_CONTAIN_NUMBER),
];

/**
 * OTP validation rules
 */
export const otpValidation = [
  body('userId')
    .trim()
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.USER_ID_REQUIRED)
    .isMongoId()
    .withMessage(VALIDATION_MESSAGES.USER_ID_INVALID),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric().withMessage(VALIDATION_MESSAGES.OTP_INVALID),
];
