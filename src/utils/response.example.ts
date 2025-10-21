/**
 * API Response Utility - Usage Examples
 *
 * This file demonstrates how to use the response utility functions
 * Copy these examples into your controllers as needed
 */

import { Request, Response } from 'express';
import { successResponse, errorResponse, PaginationOptions } from './response';

// ============================================
// EXAMPLE 1: Simple Success Response
// ============================================
export const simpleSuccess = (_req: Request, res: Response) => {
  return successResponse(res, 200, 'Operation successful');
};
// Response:
// {
//   "success": true,
//   "code": 200,
//   "message": "Operation successful"
// }

// ============================================
// EXAMPLE 2: Success with Data (Object)
// ============================================
export const successWithObject = (_req: Request, res: Response) => {
  const user = {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com',
  };

  return successResponse(res, 200, 'User retrieved successfully', user);
};
// Response:
// {
//   "success": true,
//   "code": 200,
//   "message": "User retrieved successfully",
//   "data": {
//     "id": "123",
//     "name": "John Doe",
//     "email": "john@example.com"
//   }
// }

// ============================================
// EXAMPLE 3: Success with Array (Auto Count)
// ============================================
export const successWithArray = (_req: Request, res: Response) => {
  const users = [
    { id: '1', name: 'John' },
    { id: '2', name: 'Jane' },
    { id: '3', name: 'Bob' },
  ];

  return successResponse(res, 200, 'Users retrieved successfully', users);
};
// Response:
// {
//   "success": true,
//   "code": 200,
//   "message": "Users retrieved successfully",
//   "data": [
//     { "id": "1", "name": "John" },
//     { "id": "2", "name": "Jane" },
//     { "id": "3", "name": "Bob" }
//   ],
//   "count": 3  // <-- Automatically added
// }

// ============================================
// EXAMPLE 4: Success with Pagination
// ============================================
export const successWithPagination = (_req: Request, res: Response) => {
  const users = [
    { id: '1', name: 'John' },
    { id: '2', name: 'Jane' },
    { id: '3', name: 'Bob' },
    { id: '4', name: 'Alice' },
    { id: '5', name: 'Charlie' },
  ];

  const paginationOptions: PaginationOptions = {
    page: 1, // Current page
    limit: 5, // Items per page
    totalItems: 50, // Total items in database
  };

  return successResponse(res, 200, 'Users retrieved successfully', users, paginationOptions);
};
// Response:
// {
//   "success": true,
//   "code": 200,
//   "message": "Users retrieved successfully",
//   "data": [ ... ],
//   "count": 5,
//   "pagination": {
//     "page": 1,
//     "limit": 5,
//     "totalItems": 50,
//     "totalPages": 10,
//     "hasNextPage": true,
//     "hasPrevPage": false
//   }
// }

// ============================================
// EXAMPLE 5: Simple Error Response
// ============================================
export const simpleError = (_req: Request, res: Response) => {
  return errorResponse(res, 400, 'Invalid request');
};
// Response:
// {
//   "success": false,
//   "code": 400,
//   "message": "Invalid request"
// }

// ============================================
// EXAMPLE 6: Error with Details
// ============================================
export const errorWithDetails = (_req: Request, res: Response) => {
  const validationErrors = [
    { field: 'email', message: 'Email is required' },
    { field: 'password', message: 'Password must be at least 6 characters' },
  ];

  return errorResponse(res, 400, 'Validation failed', validationErrors);
};
// Response:
// {
//   "success": false,
//   "code": 400,
//   "message": "Validation failed",
//   "error": [
//     { "field": "email", "message": "Email is required" },
//     { "field": "password", "message": "Password must be at least 6 characters" }
//   ]
// }

// ============================================
// EXAMPLE 7: Complete Controller Example
// ============================================
export class ExampleController {
  async getUsers(req: Request, res: Response) {
    try {
      // Get pagination params from query
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Simulate database query
      // In real app: const users = await User.find().skip((page - 1) * limit).limit(limit);
      // In real app: const totalItems = await User.countDocuments();
      const users = [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
      ];
      const totalItems = 25; // Total count from database

      // Return paginated response
      return successResponse(res, 200, 'Users retrieved successfully', users, {
        page,
        limit,
        totalItems,
      });
    } catch (error: any) {
      return errorResponse(res, 500, 'Failed to retrieve users', error.message);
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const { name, email } = req.body;

      // Validation
      if (!name || !email) {
        return errorResponse(res, 400, 'Name and email are required');
      }

      // Simulate user creation
      const newUser = {
        id: '123',
        name,
        email,
        createdAt: new Date(),
      };

      return successResponse(res, 201, 'User created successfully', newUser);
    } catch (error: any) {
      return errorResponse(res, 500, 'Failed to create user', error.message);
    }
  }
}

// ============================================
// EXAMPLE 8: Real-world MongoDB Pagination
// ============================================
export const mongodbPaginationExample = async (req: Request, res: Response) => {
  try {
    // Get pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit; // For database queries

    // MongoDB queries (in real app, uncomment and use skip variable)
    // const users = await User.find()
    //   .skip(skip)
    //   .limit(limit)
    //   .sort({ createdAt: -1 });
    // const totalItems = await User.countDocuments();

    // Mock data for example
    const users = [{ id: '1', name: 'John' }];
    const totalItems = 100;
    console.log(`Would skip ${skip} items`); // Just to use skip variable

    return successResponse(res, 200, 'Users retrieved successfully', users, {
      page,
      limit,
      totalItems,
    });
  } catch (error: any) {
    return errorResponse(res, 500, 'Failed to retrieve users', error.message);
  }
};
