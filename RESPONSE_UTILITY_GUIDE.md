# API Response Utility Guide

This guide explains how to use the standardized API response utility in your application.

## 📦 Location

`src/utils/response.ts`

## 🔧 Functions

### `successResponse(res, code, message, data, paginationOptions)`

Returns a standardized success response.

**Parameters:**
- `res` - Express response object
- `code` - HTTP status code (default: 200)
- `message` - Success message (optional)
- `data` - Response data (optional)
- `paginationOptions` - Pagination details (optional)

**Response Structure:**
```typescript
{
  success: true,
  code: 200,
  message?: string,
  data?: any,
  count?: number,        // Auto-added for arrays
  pagination?: Pagination
}
```

### `errorResponse(res, code, message, error)`

Returns a standardized error response.

**Parameters:**
- `res` - Express response object
- `code` - HTTP status code (default: 500)
- `message` - Error message
- `error` - Error details (optional)

**Response Structure:**
```typescript
{
  success: false,
  code: 400,
  message: string,
  error?: any
}
```

## 📊 Pagination Interface

```typescript
interface Pagination {
  page: number;          // Current page number
  limit: number;         // Items per page
  totalItems: number;    // Total items in database
  totalPages: number;    // Total pages (calculated)
  hasNextPage: boolean;  // Has next page (calculated)
  hasPrevPage: boolean;  // Has previous page (calculated)
}
```

## 💡 Usage Examples

### 1. Simple Success Response

```typescript
import { successResponse } from '../utils/response';

return successResponse(res, 200, 'Operation successful');
```

**Output:**
```json
{
  "success": true,
  "code": 200,
  "message": "Operation successful"
}
```

### 2. Success with Data (Object)

```typescript
const user = { id: '123', name: 'John', email: 'john@example.com' };
return successResponse(res, 200, 'User retrieved', user);
```

**Output:**
```json
{
  "success": true,
  "code": 200,
  "message": "User retrieved",
  "data": {
    "id": "123",
    "name": "John",
    "email": "john@example.com"
  }
}
```

### 3. Success with Array (Auto Count)

```typescript
const users = [
  { id: '1', name: 'John' },
  { id: '2', name: 'Jane' }
];
return successResponse(res, 200, 'Users retrieved', users);
```

**Output:**
```json
{
  "success": true,
  "code": 200,
  "message": "Users retrieved",
  "data": [
    { "id": "1", "name": "John" },
    { "id": "2", "name": "Jane" }
  ],
  "count": 2
}
```

### 4. Success with Pagination

```typescript
const users = await User.find().skip((page - 1) * limit).limit(limit);
const totalItems = await User.countDocuments();

return successResponse(
  res,
  200,
  'Users retrieved',
  users,
  { page: 1, limit: 10, totalItems }
);
```

**Output:**
```json
{
  "success": true,
  "code": 200,
  "message": "Users retrieved",
  "data": [...],
  "count": 10,
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 5. Error Response

```typescript
return errorResponse(res, 400, 'Invalid email format');
```

**Output:**
```json
{
  "success": false,
  "code": 400,
  "message": "Invalid email format"
}
```

### 6. Error with Details

```typescript
const errors = [
  { field: 'email', message: 'Email is required' },
  { field: 'password', message: 'Password too short' }
];
return errorResponse(res, 400, 'Validation failed', errors);
```

**Output:**
```json
{
  "success": false,
  "code": 400,
  "message": "Validation failed",
  "error": [
    { "field": "email", "message": "Email is required" },
    { "field": "password", "message": "Password too short" }
  ]
}
```

## 🎯 Complete Controller Example

```typescript
import express from 'express';
import { successResponse, errorResponse, PaginationOptions } from '../utils/response';
import User from '../models/User.model';

class UserController {
  /**
   * Get all users with pagination
   */
  async getUsers(req: express.Request, res: express.Response) {
    try {
      // Extract pagination params
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Fetch data from database
      const users = await User.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
      
      const totalItems = await User.countDocuments();

      // Return paginated response
      return successResponse(
        res,
        200,
        'Users retrieved successfully',
        users,
        { page, limit, totalItems }
      );
    } catch (error: any) {
      return errorResponse(
        res,
        500,
        'Failed to retrieve users',
        error.message
      );
    }
  }

  /**
   * Get single user by ID
   */
  async getUserById(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        return errorResponse(res, 404, 'User not found');
      }

      return successResponse(res, 200, 'User retrieved successfully', user);
    } catch (error: any) {
      return errorResponse(res, 500, 'Failed to retrieve user', error.message);
    }
  }

  /**
   * Create new user
   */
  async createUser(req: express.Request, res: express.Response) {
    try {
      const { name, email } = req.body;

      // Validation
      if (!name || !email) {
        return errorResponse(res, 400, 'Name and email are required');
      }

      // Create user
      const user = new User({ name, email });
      await user.save();

      return successResponse(res, 201, 'User created successfully', user);
    } catch (error: any) {
      return errorResponse(res, 500, 'Failed to create user', error.message);
    }
  }
}

export default new UserController();
```

## 📝 Status Code Guide

### Success Codes
- `200` - OK (General success)
- `201` - Created (Resource created)
- `204` - No Content (Success, no data to return)

### Client Error Codes
- `400` - Bad Request (Invalid input)
- `401` - Unauthorized (Authentication required)
- `403` - Forbidden (No permission)
- `404` - Not Found (Resource doesn't exist)
- `422` - Unprocessable Entity (Validation failed)

### Server Error Codes
- `500` - Internal Server Error (General error)
- `503` - Service Unavailable (Temporary)

## 🔄 Backward Compatibility

Legacy function names are still available:
- `sendSuccess()` → Same as `successResponse()`
- `sendError()` → Same as `errorResponse()`

## ✨ Features

✅ **Consistent Structure** - All responses follow the same format  
✅ **Auto Count** - Automatically adds count for array data  
✅ **Smart Pagination** - Calculates totalPages, hasNext/PrevPage  
✅ **TypeScript Support** - Full type definitions included  
✅ **Flexible** - All fields are optional except required ones  
✅ **Clean Code** - Easy to read and maintain  

## 🚀 Best Practices

1. **Always use status codes appropriately**
   ```typescript
   // Good
   return successResponse(res, 201, 'User created', user);
   
   // Bad
   return successResponse(res, 200, 'User created', user); // Should be 201
   ```

2. **Provide meaningful messages**
   ```typescript
   // Good
   return errorResponse(res, 400, 'Email format is invalid');
   
   // Bad
   return errorResponse(res, 400, 'Error');
   ```

3. **Include error details in development**
   ```typescript
   return errorResponse(
     res,
     500,
     'Database error',
     process.env.NODE_ENV === 'development' ? error.stack : undefined
   );
   ```

4. **Use pagination for large datasets**
   ```typescript
   // Always paginate lists
   const users = await User.find().limit(limit).skip(skip);
   return successResponse(res, 200, 'Users', users, { page, limit, totalItems });
   ```

## 📚 TypeScript Interfaces

Import and use the interfaces in your code:

```typescript
import { ApiResponse, Pagination, PaginationOptions } from '../utils/response';

// Type your response
const response: ApiResponse<User> = {
  success: true,
  code: 200,
  data: user
};

// Type pagination options
const options: PaginationOptions = {
  page: 1,
  limit: 10,
  totalItems: 100
};
```

