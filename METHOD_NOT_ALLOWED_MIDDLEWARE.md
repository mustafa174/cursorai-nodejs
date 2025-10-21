# 405 Method Not Allowed Middleware

## ✅ Implementation Complete

A custom Express middleware that returns proper HTTP 405 "Method Not Allowed" responses when a route path exists but the HTTP method is not supported.

## 📋 Overview

The middleware automatically detects when:
- A route path exists in your application
- The HTTP method used (GET, POST, PUT, DELETE, etc.) is NOT allowed for that path
- Returns a 405 status with the `Allow` header listing allowed methods

This improves API user experience by clearly indicating which methods are supported for each endpoint.

## 🔧 Implementation

### File Location
```
src/middleware/methodNotAllowed.middleware.ts
```

### Integration in app.ts

The middleware is placed in a specific order:
```typescript
// 1. All routes registered first
app.use(API_PREFIX, routes);
app.get(FULL_ROUTES.ROOT, rootHandler);

// 2. Method Not Allowed handler (checks existing routes)
app.use(methodNotAllowedMiddleware(app));

// 3. 404 Not Found handler (for non-existent routes)
app.use(notFoundHandler);

// 4. Global error handler
app.use(errorHandler);
```

## 📡 Response Format

### 405 Method Not Allowed Response

```json
{
  "success": false,
  "code": 405,
  "message": "Method POST not allowed for this endpoint. Use one of: GET",
  "error": {
    "error": "MethodNotAllowed",
    "allowed": ["GET"]
  }
}
```

**Headers:**
```
HTTP/1.1 405 Method Not Allowed
Allow: GET
Content-Type: application/json
```

## 🧪 Test Results

### Test 1: POST on GET-only route
```bash
curl -X POST http://localhost:5000/api/health
```

**Response:**
```json
{
  "success": false,
  "code": 405,
  "message": "Method POST not allowed for this endpoint. Use one of: GET",
  "error": {
    "error": "MethodNotAllowed",
    "allowed": ["GET"]
  }
}
```
**Status:** `405 Method Not Allowed`  
**Allow Header:** `GET`

✅ **Result:** Working correctly

### Test 2: GET on POST-only route
```bash
curl -X GET http://localhost:5000/api/auth/signin
```

**Response:**
```json
{
  "success": false,
  "code": 405,
  "message": "Method GET not allowed for this endpoint. Use one of: POST",
  "error": {
    "error": "MethodNotAllowed",
    "allowed": ["POST"]
  }
}
```
**Status:** `405 Method Not Allowed`  
**Allow Header:** `POST`

✅ **Result:** Working correctly

### Test 3: Non-existent route
```bash
curl -X GET http://localhost:5000/api/non-existent-route
```

**Response:**
```json
{
  "success": false,
  "code": 404,
  "message": "Route /api/non-existent-route not found"
}
```
**Status:** `404 Not Found`

✅ **Result:** 404 handler works correctly (doesn't interfere with 405 middleware)

### Test 4: Valid method on valid route
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Response:**
```json
{
  "success": true,
  "code": 200,
  "message": "OTP generated successfully. Please verify to complete login.",
  "data": {
    "userId": "68f78b723042a7d624fd8ad8",
    "otp": "103636"
  }
}
```
**Status:** `200 OK`

✅ **Result:** Normal requests work correctly

## 🎯 Features

### 1. **Automatic Route Detection**
- Scans all registered routes in the Express app
- Extracts allowed methods for each route
- Works with nested routers and route parameters

### 2. **Route Parameter Support**
```typescript
// Routes like /api/users/:id work correctly
GET /api/users/123    → 200 OK
POST /api/users/123   → 405 Method Not Allowed (if only GET allowed)
```

### 3. **Allow Header**
- Automatically sets the `Allow` header
- Lists all supported HTTP methods for the route
- Follows HTTP specification (RFC 7231)

### 4. **Consistent Error Format**
- Uses the project's standard error response format
- Includes error type for programmatic handling
- Lists allowed methods in response body

### 5. **Correct Order**
```
Request → Routes → 405 Handler → 404 Handler → Error Handler
```

## 🔍 How It Works

### 1. Route Extraction
```typescript
function extractRoutes(app: Application): Map<string, Set<string>>
```
- Traverses Express router stack
- Identifies all registered routes
- Collects allowed methods for each route
- Returns a map of paths to allowed methods

### 2. Route Matching
```typescript
function findMatchingRoute(requestPath: string, routes: Map<...>)
```
- Normalizes route paths (handles parameters like `:id`)
- Converts routes to regex patterns
- Matches request path against all routes

### 3. Method Validation
```typescript
if (matchingRoute && !allowedMethods.includes(requestMethod))
```
- Checks if request method is in allowed methods
- Returns 405 if not allowed
- Passes to next middleware if allowed or route doesn't exist

## 📝 Code Example

### Basic Usage (Already Integrated)
```typescript
import { methodNotAllowedMiddleware } from './middleware/methodNotAllowed.middleware';

// After routes, before 404 handler
app.use(methodNotAllowedMiddleware(app));
```

### Alternative: Route-Specific Handler
```typescript
import { methodNotAllowedHandler } from './middleware/methodNotAllowed.middleware';

// Explicitly define allowed methods for a route
router.all('/users/:id', methodNotAllowedHandler(['GET', 'PUT', 'DELETE']));
```

## 🚀 Benefits

### 1. **Better Developer Experience**
Developers using your API get clear feedback about which methods are supported:
```
❌ Before: "404 Not Found" (confusing - route exists!)
✅ After: "405 Method Not Allowed. Use one of: POST" (clear!)
```

### 2. **HTTP Specification Compliance**
- Follows RFC 7231 standards
- Returns correct status code (405 vs 404)
- Includes required `Allow` header

### 3. **Improved API Documentation**
- Responses tell users what methods ARE allowed
- Self-documenting API behavior
- Reduces support questions

### 4. **Client-Friendly**
Clients can:
- Parse the `allowed` array programmatically
- Display helpful error messages to end users
- Automatically retry with correct method

## 🔒 Security Considerations

### Information Disclosure
The middleware reveals which routes exist by returning 405 instead of 404.

**Mitigation:**
- This is standard HTTP behavior
- Most APIs do this (GitHub, Stripe, etc.)
- Alternative: Return 404 for unauthorized routes (requires custom logic)

### Rate Limiting
- 405 responses are still rate-limited
- Middleware runs AFTER rate limiting
- No bypass of security measures

## 📊 Comparison

### Before (Without 405 Middleware)
```
GET /api/auth/signin → 404 Not Found
```
**Problems:**
- Confusing (route exists, wrong method)
- No indication of correct method
- Developer has to check documentation

### After (With 405 Middleware)
```
GET /api/auth/signin → 405 Method Not Allowed
Allow: POST
{
  "allowed": ["POST"]
}
```
**Benefits:**
- Clear error message
- Shows correct method
- Self-documenting

## 🛠️ Customization

### Change Error Message Format
Edit `src/middleware/methodNotAllowed.middleware.ts`:

```typescript
return sendError(
  res,
  405,
  `Your custom message here`,
  {
    error: 'MethodNotAllowed',
    allowed: allowedMethods,
  }
);
```

### Add Custom Logic
```typescript
export function methodNotAllowedMiddleware(app: Application) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Your custom logic here
    
    // Log for analytics
    console.log(`405 on ${req.method} ${req.path}`);
    
    // Continue with normal flow
    // ...
  };
}
```

## 📚 References

- [RFC 7231 - HTTP/1.1 Semantics](https://tools.ietf.org/html/rfc7231#section-6.5.5)
- [Express.js Router Documentation](https://expressjs.com/en/4x/api.html#router)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405)

## ✅ Summary

- ✅ Middleware created at `src/middleware/methodNotAllowed.middleware.ts`
- ✅ Integrated in `src/app.ts` (correct order)
- ✅ Returns proper 405 responses
- ✅ Includes `Allow` header
- ✅ Supports route parameters (`:id`, etc.)
- ✅ Works with nested routers
- ✅ All tests passing
- ✅ No lint errors
- ✅ TypeScript compilation successful

The 405 Method Not Allowed middleware is fully functional and production-ready! 🎉

