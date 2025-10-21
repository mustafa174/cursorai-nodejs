/**
 * API Route Constants
 * Centralized route paths for better maintainability
 */

export const API_PREFIX = '/api';

export const AUTH_ROUTES = {
  BASE: '/auth',
  SIGNUP: '/signup',
  SIGNIN: '/signin',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  GENERATE_OTP: '/generate-otp',
  VERIFY_OTP: '/verify-otp',
  DISPLAY_PICTURE: '/display-picture/:userId',
};

export const GENERAL_ROUTES = {
  HEALTH: '/health',
  ROOT: '/',
};

/**
 * Full route paths for documentation
 */
export const FULL_ROUTES = {
  // General
  ROOT: GENERAL_ROUTES.ROOT,
  HEALTH: `${API_PREFIX}${GENERAL_ROUTES.HEALTH}`,

  // Auth
  AUTH_SIGNUP: `${API_PREFIX}${AUTH_ROUTES.BASE}${AUTH_ROUTES.SIGNUP}`,
  AUTH_SIGNIN: `${API_PREFIX}${AUTH_ROUTES.BASE}${AUTH_ROUTES.SIGNIN}`,
  AUTH_FORGOT_PASSWORD: `${API_PREFIX}${AUTH_ROUTES.BASE}${AUTH_ROUTES.FORGOT_PASSWORD}`,
  AUTH_RESET_PASSWORD: `${API_PREFIX}${AUTH_ROUTES.BASE}${AUTH_ROUTES.RESET_PASSWORD}`,
  AUTH_GENERATE_OTP: `${API_PREFIX}${AUTH_ROUTES.BASE}${AUTH_ROUTES.GENERATE_OTP}`,
  AUTH_VERIFY_OTP: `${API_PREFIX}${AUTH_ROUTES.BASE}${AUTH_ROUTES.VERIFY_OTP}`,
  AUTH_DISPLAY_PICTURE: `${API_PREFIX}${AUTH_ROUTES.BASE}${AUTH_ROUTES.DISPLAY_PICTURE}`,
};
