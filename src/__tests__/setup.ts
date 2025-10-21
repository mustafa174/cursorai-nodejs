/**
 * Test Setup File
 * Runs before all tests
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '5001';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_EXPIRES_IN = '7d';
process.env.OTP_EXPIRES_IN = '300000'; // 5 minutes
process.env.RESET_TOKEN_EXPIRES_IN = '3600000'; // 1 hour
process.env.CORS_ORIGIN = 'http://localhost:3000';
process.env.BASE_URL = 'http://localhost:5001';

// Email settings
process.env.EMAIL_HOST = 'smtp.test.com';
process.env.EMAIL_PORT = '587';
process.env.EMAIL_USER = 'test@test.com';
process.env.EMAIL_PASS = 'test-password';
process.env.EMAIL_FROM = 'noreply@test.com';

// Increase timeout for async operations
jest.setTimeout(10000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
