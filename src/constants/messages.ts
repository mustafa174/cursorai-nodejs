/**
 * API Response Messages Constants
 * Centralized messages for consistent API responses
 */

export const SUCCESS_MESSAGES = {
  // Authentication
  USER_REGISTERED: 'User registered successfully. Please verify your email with the OTP sent.',
  USER_LOGGED_IN: 'User logged in successfully',
  OTP_GENERATED: 'OTP generated successfully. Please verify to complete login.',
  OTP_VERIFIED: 'OTP verified successfully. Login complete.',
  OTP_SENT: 'OTP sent to your email',
  PASSWORD_RESET_REQUESTED: 'If the email exists, a password reset link has been sent',
  PASSWORD_RESET_SUCCESS: 'Password reset successfully',
  EMAIL_VERIFIED: 'Email verified successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',

  // General
  OPERATION_SUCCESS: 'Operation completed successfully',
  DATA_RETRIEVED: 'Data retrieved successfully',
  DATA_UPDATED: 'Data updated successfully',
  DATA_DELETED: 'Data deleted successfully',
} as const;

export const ERROR_MESSAGES = {
  // Authentication
  INVALID_CREDENTIALS: 'Invalid email or password',
  INVALID_EMAIL_PASSWORD: 'Please provide email and password',
  INVALID_TOKEN: 'Invalid or expired token',
  UNAUTHORIZED: 'Unauthorized access',
  TOKEN_REQUIRED: 'Authentication token is required',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  USER_NOT_FOUND: 'User not found',
  INVALID_OTP: 'Invalid OTP',
  OTP_EXPIRED: 'OTP has expired',
  OTP_NOT_FOUND: 'No OTP found for this user',

  // Validation
  VALIDATION_FAILED: 'Validation failed',
  INVALID_INPUT: 'Invalid input provided',
  REQUIRED_FIELDS_MISSING: 'Please provide all required fields',
  INVALID_EMAIL: 'Please provide a valid email address',
  INVALID_PASSWORD: 'Password must be at least 6 characters',
  PASSWORD_MISMATCH: 'Passwords do not match',

  // File Upload
  FILE_TOO_LARGE: 'File size exceeds maximum limit',
  INVALID_FILE_TYPE: 'Invalid file type',
  FILE_UPLOAD_FAILED: 'File upload failed',
  DISPLAY_PICTURE_INVALID: 'Display picture must be JPG, JPEG, or PNG only',
  DISPLAY_PICTURE_NOT_FOUND: 'Display picture not found',

  // General
  INTERNAL_SERVER_ERROR: 'Internal server error',
  NOT_FOUND: 'Resource not found',
  METHOD_NOT_ALLOWED: 'Method not allowed',
  TOO_MANY_REQUESTS: 'Too many requests, please try again later',
  OPERATION_FAILED: 'Operation failed',

  // Specific Operations
  SIGNUP_FAILED: 'Failed to register user',
  SIGNIN_FAILED: 'Authentication failed',
  OTP_GENERATION_FAILED: 'Failed to generate OTP',
  OTP_VERIFICATION_FAILED: 'Failed to verify OTP',
  PASSWORD_RESET_FAILED: 'Failed to reset password',
  PASSWORD_RESET_REQUEST_FAILED: 'Failed to process password reset request',
  EMAIL_SEND_FAILED: 'Failed to send email',
  DISPLAY_PICTURE_RETRIEVAL_FAILED: 'Failed to retrieve display picture',
} as const;

export const VALIDATION_MESSAGES = {
  // Name
  NAME_REQUIRED: 'Name is required',
  NAME_MIN_LENGTH: 'Name must be at least 2 characters',
  NAME_MAX_LENGTH: 'Name must not exceed 50 characters',

  // Email
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please provide a valid email address',

  // Password
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  PASSWORD_MUST_CONTAIN_NUMBER: 'Password must contain at least one number',
  NEW_PASSWORD_REQUIRED: 'New password is required',

  // OTP
  OTP_REQUIRED: 'OTP is required',
  OTP_INVALID: 'OTP must be a 6-digit number',
  USER_ID_REQUIRED: 'User ID is required',
  USER_ID_INVALID: 'Please provide a valid user ID',

  // Token
  TOKEN_REQUIRED: 'Token is required',

  // Phone
  PHONE_INVALID: 'Phone must be a string',
  PHONE_LENGTH: 'Phone must be between 6 and 20 characters',
  PHONE_FORMAT: 'Phone must contain only numbers, spaces, and valid characters (+, -, (), spaces)',

  // Address
  ADDRESS_INVALID: 'Address must be a string',
  ADDRESS_MAX_LENGTH: 'Address must not exceed 200 characters',

  // Country
  COUNTRY_INVALID: 'Country must be a string',
  COUNTRY_MAX_LENGTH: 'Country must not exceed 100 characters',
  COUNTRY_FORMAT: 'Country must contain only letters, spaces, and hyphens',

  // Display Picture
  DISPLAY_PICTURE_TYPE: 'Display picture must be JPG, JPEG, or PNG only',
  DISPLAY_PICTURE_SIZE: 'Display picture must not exceed 10MB',
} as const;

export const INFO_MESSAGES = {
  API_NAME: 'Node.js TypeScript REST API Boilerplate',
  API_VERSION: '1.0.0',
  SERVER_STARTED: 'Server started successfully',
  DATABASE_CONNECTED: 'MongoDB connected successfully',
  DATABASE_DISCONNECTED: 'MongoDB disconnected',
} as const;

// Export all messages as a single object for convenience
export const MESSAGES = {
  SUCCESS: SUCCESS_MESSAGES,
  ERROR: ERROR_MESSAGES,
  VALIDATION: VALIDATION_MESSAGES,
  INFO: INFO_MESSAGES,
} as const;
