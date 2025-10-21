# Constants Implementation - Complete Guide

## ✅ Overview
All hardcoded status codes and reusable strings have been moved into centralized constant files for better maintainability, consistency, and code quality.

---

## 📁 New Constants Files

### 1. **`src/constants/httpStatus.ts`**
HTTP status codes for all API responses.

```typescript
export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;
```

### 2. **`src/constants/messages.ts`**
All reusable messages organized by category.

**Categories:**
- `SUCCESS_MESSAGES` - Success operation messages
- `ERROR_MESSAGES` - Error messages
- `VALIDATION_MESSAGES` - Input validation messages
- `INFO_MESSAGES` - General information messages

```typescript
export const SUCCESS_MESSAGES = {
  USER_REGISTERED: 'User registered successfully. Please verify your email with the OTP sent.',
  OTP_GENERATED: 'OTP generated successfully. Please verify to complete login.',
  OTP_VERIFIED: 'OTP verified successfully. Login complete.',
  PASSWORD_RESET_SUCCESS: 'Password reset successfully',
  // ... more
};

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  INVALID_TOKEN: 'Invalid or expired token',
  USER_NOT_FOUND: 'User not found',
  VALIDATION_FAILED: 'Validation failed',
  // ... more
};

export const VALIDATION_MESSAGES = {
  EMAIL_INVALID: 'Please provide a valid email address',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  OTP_INVALID: 'OTP must be a 6-digit number',
  PHONE_LENGTH: 'Phone must be between 6 and 20 characters',
  // ... more
};
```

---

## 🔄 Files Updated

### **Controllers:**
- ✅ `src/controllers/auth.controller.ts`

### **Services:**
- ✅ `src/services/auth.service.ts`

### **Middleware:**
- ✅ `src/middleware/auth.middleware.ts`
- ✅ `src/middleware/validation.middleware.ts`
- ✅ `src/middleware/error.middleware.ts`
- ✅ `src/middleware/upload.middleware.ts`
- ✅ `src/middleware/methodNotAllowed.middleware.ts`

### **Routes:**
- ✅ `src/routes/index.ts`

### **App:**
- ✅ `src/app.ts`

---

## 📊 Before vs After

### **Before (Hardcoded):**
```typescript
// auth.controller.ts
return sendError(res, 400, 'Please provide email and password');
return sendSuccess(res, 201, 'User registered successfully');
```

### **After (Constants):**
```typescript
// auth.controller.ts
import { HTTP_STATUS } from '../constants/httpStatus';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/messages';

return sendError(res, HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_EMAIL_PASSWORD);
return sendSuccess(res, HTTP_STATUS.CREATED, SUCCESS_MESSAGES.USER_REGISTERED);
```

---

## ✨ Benefits

### 1. **Consistency**
- All status codes and messages are uniform across the application
- No typos or variations in error messages

### 2. **Maintainability**
- Change a message once, it updates everywhere
- Easy to update response codes or messages

### 3. **Type Safety**
- TypeScript ensures you use valid constants
- IDE autocomplete for all messages and status codes

### 4. **Centralized Control**
- Single source of truth for all messages
- Easy to review and audit all error messages

### 5. **Internationalization Ready**
- Easy to replace with i18n keys in the future
- Structured for translation support

### 6. **Better Testing**
- Use constants in tests for consistency
- No magic strings or numbers

---

## 🎯 Usage Examples

### **In Controllers:**
```typescript
import { HTTP_STATUS } from '../constants/httpStatus';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/messages';

// Success response
return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.OTP_VERIFIED, { user, token });

// Error response
return sendError(res, HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
```

### **In Services:**
```typescript
import { ERROR_MESSAGES } from '../constants/messages';

if (!user) {
  throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
}
```

### **In Middleware:**
```typescript
import { HTTP_STATUS } from '../constants/httpStatus';
import { ERROR_MESSAGES } from '../constants/messages';

if (!token) {
  return sendError(res, HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.TOKEN_REQUIRED);
}
```

### **In Validation:**
```typescript
import { VALIDATION_MESSAGES } from '../constants/messages';

body('email')
  .isEmail()
  .withMessage(VALIDATION_MESSAGES.EMAIL_INVALID),

body('password')
  .isLength({ min: 6 })
  .withMessage(VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH)
```

---

## 📋 Complete List of Constants

### **HTTP Status Codes:**
- `HTTP_STATUS.OK` → 200
- `HTTP_STATUS.CREATED` → 201
- `HTTP_STATUS.BAD_REQUEST` → 400
- `HTTP_STATUS.UNAUTHORIZED` → 401
- `HTTP_STATUS.FORBIDDEN` → 403
- `HTTP_STATUS.NOT_FOUND` → 404
- `HTTP_STATUS.METHOD_NOT_ALLOWED` → 405
- `HTTP_STATUS.INTERNAL_SERVER_ERROR` → 500

### **Success Messages:**
- `SUCCESS_MESSAGES.USER_REGISTERED`
- `SUCCESS_MESSAGES.OTP_GENERATED`
- `SUCCESS_MESSAGES.OTP_VERIFIED`
- `SUCCESS_MESSAGES.OTP_SENT`
- `SUCCESS_MESSAGES.PASSWORD_RESET_REQUESTED`
- `SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS`

### **Error Messages:**
- `ERROR_MESSAGES.INVALID_CREDENTIALS`
- `ERROR_MESSAGES.INVALID_EMAIL_PASSWORD`
- `ERROR_MESSAGES.INVALID_TOKEN`
- `ERROR_MESSAGES.USER_NOT_FOUND`
- `ERROR_MESSAGES.TOKEN_REQUIRED`
- `ERROR_MESSAGES.VALIDATION_FAILED`
- `ERROR_MESSAGES.EMAIL_ALREADY_EXISTS`
- `ERROR_MESSAGES.OTP_NOT_FOUND`
- `ERROR_MESSAGES.OTP_EXPIRED`
- `ERROR_MESSAGES.INVALID_OTP`
- `ERROR_MESSAGES.DISPLAY_PICTURE_NOT_FOUND`

### **Validation Messages:**
- `VALIDATION_MESSAGES.EMAIL_REQUIRED`
- `VALIDATION_MESSAGES.EMAIL_INVALID`
- `VALIDATION_MESSAGES.PASSWORD_REQUIRED`
- `VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH`
- `VALIDATION_MESSAGES.PASSWORD_MUST_CONTAIN_NUMBER`
- `VALIDATION_MESSAGES.OTP_INVALID`
- `VALIDATION_MESSAGES.USER_ID_REQUIRED`
- `VALIDATION_MESSAGES.USER_ID_INVALID`
- `VALIDATION_MESSAGES.PHONE_LENGTH`
- `VALIDATION_MESSAGES.ADDRESS_MAX_LENGTH`
- `VALIDATION_MESSAGES.COUNTRY_MAX_LENGTH`
- `VALIDATION_MESSAGES.DISPLAY_PICTURE_TYPE`

---

## 🔧 Adding New Constants

### **Step 1: Add to Constants File**
```typescript
// src/constants/messages.ts
export const ERROR_MESSAGES = {
  // ... existing messages
  NEW_ERROR: 'Your new error message',
} as const;
```

### **Step 2: Import and Use**
```typescript
// your-file.ts
import { ERROR_MESSAGES } from '../constants/messages';

throw new Error(ERROR_MESSAGES.NEW_ERROR);
```

---

## 📝 Best Practices

### **DO:**
✅ Use constants for all status codes  
✅ Use constants for all reusable messages  
✅ Import only the constants you need  
✅ Keep messages clear and user-friendly  
✅ Group related messages together  

### **DON'T:**
❌ Hardcode status codes  
❌ Hardcode error messages  
❌ Create dynamic messages with concatenation (use template literals if needed)  
❌ Import all constants if you only need a few  

---

## 🧪 Testing

### **Before:**
```typescript
// Hard to maintain, easy to break
expect(response.status).toBe(401);
expect(response.body.message).toBe('Invalid email or password');
```

### **After:**
```typescript
import { HTTP_STATUS } from '../constants/httpStatus';
import { ERROR_MESSAGES } from '../constants/messages';

expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_CREDENTIALS);
```

---

## 🌐 Future Enhancements

### **Internationalization (i18n):**
```typescript
// Easy to replace with i18n keys
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: t('errors.invalidCredentials'),
  USER_NOT_FOUND: t('errors.userNotFound'),
};
```

### **Logging Integration:**
```typescript
// Add error codes for tracking
export const ERROR_CODES = {
  AUTH_001: 'Invalid credentials',
  AUTH_002: 'Token expired',
  // ... etc
};
```

---

## ✅ Summary

### **Created:**
- ✅ `src/constants/httpStatus.ts` - HTTP status codes
- ✅ `src/constants/messages.ts` - All messages (success, error, validation, info)

### **Updated:**
- ✅ 9 files to use constants instead of hardcoded values
- ✅ All controllers, services, middleware, routes, and app files

### **Benefits:**
- ✅ Better maintainability
- ✅ Type safety
- ✅ Consistency
- ✅ Easier testing
- ✅ Ready for i18n

### **Result:**
**100% of hardcoded strings and status codes replaced with constants!** 🎉

---

## 🚀 Usage in Your Project

```bash
# Build project
npm run build

# Run tests
npm test

# Start server
npm run dev
```

All endpoints now use standardized status codes and messages throughout the application!

