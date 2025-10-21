import { Response } from 'express';

/**
 * Pagination Interface
 */
export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * API Response Interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  message?: string;
  data?: T;
  count?: number;
  pagination?: Pagination;
  error?: any;
}

/**
 * Pagination Options Interface
 */
export interface PaginationOptions {
  page: number;
  limit: number;
  totalItems: number;
}

/**
 * Calculate pagination details
 */
const calculatePagination = (options: PaginationOptions): Pagination => {
  const { page, limit, totalItems } = options;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

/**
 * Success Response
 * @param res - Express response object
 * @param code - HTTP status code (default: 200)
 * @param message - Success message
 * @param data - Response data
 * @param paginationOptions - Pagination options (optional)
 */
export const successResponse = <T = any>(
  res: Response,
  code: number = 200,
  message?: string,
  data?: T,
  paginationOptions?: PaginationOptions
): any => {
  const response: ApiResponse<T> = {
    success: true,
    code,
  };

  // Add message if provided
  if (message) {
    response.message = message;
  }

  // Add data if provided
  if (data !== undefined) {
    response.data = data;

    // Automatically add count for array data
    if (Array.isArray(data)) {
      response.count = data.length;
    }
  }

  // Add pagination if options provided
  if (paginationOptions) {
    response.pagination = calculatePagination(paginationOptions);
  }

  return (res as any).status(code).json(response);
};

/**
 * Error Response
 * @param res - Express response object
 * @param code - HTTP status code (default: 500)
 * @param message - Error message
 * @param error - Error details (optional)
 */
export const errorResponse = (
  res: Response,
  code: number = 500,
  message: string = 'Internal server error',
  error?: any
): any => {
  const response: ApiResponse = {
    success: false,
    code,
    message,
  };

  // Add error details if provided
  if (error !== undefined) {
    response.error = error;
  }

  return (res as any).status(code).json(response);
};

/**
 * Legacy function names for backward compatibility
 */
export const sendSuccess = successResponse;
export const sendError = errorResponse;
