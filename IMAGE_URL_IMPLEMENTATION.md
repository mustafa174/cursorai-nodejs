# Display Picture URL Implementation

## Overview
Updated the display picture implementation to return image URLs instead of large base64 encoded strings in JSON responses.

## What Changed

### 1. **User Model (`src/models/User.model.ts`)**
- Modified `toJSON` method to return image URL instead of base64 data
- URL format: `http://localhost:5000/api/auth/display-picture/{userId}`
- Still stores images as Buffer in MongoDB (unchanged)

```typescript
// Before (returned base64 string)
displayPicture: {
  data: "iVBORw0KGgoAAAA...", // Large base64 string
  contentType: "image/jpeg"
}

// After (returns URL)
displayPicture: {
  url: "http://localhost:5000/api/auth/display-picture/507f1f77bcf86cd799439011",
  contentType: "image/jpeg"
}
```

### 2. **New Image Serving Endpoint**
**Route:** `GET /api/auth/display-picture/:userId`

**Purpose:** Serves the user's display picture directly as an image file

**Response:**
- Content-Type: `image/jpeg`, `image/png`, etc.
- Body: Raw image binary data

### 3. **Updated Files**

#### **Added:**
- `src/controllers/auth.controller.ts` - `getDisplayPicture()` method
- `src/services/auth.service.ts` - `getUserById()` method
- `src/constants/routes.ts` - `DISPLAY_PICTURE` route constant
- `src/routes/auth.routes.ts` - GET endpoint for display pictures

#### **Modified:**
- `src/models/User.model.ts` - Updated `toJSON()` method
- `src/config/swagger.ts` - Updated User schema
- `.env.example` - Added `BASE_URL` environment variable

## Benefits

### ✅ **Improved Performance**
- JSON responses are now much smaller
- No need to encode/decode large base64 strings
- Faster API response times

### ✅ **Better UX**
- Images can be loaded on-demand
- Browsers can cache images separately
- Supports lazy loading

### ✅ **RESTful Design**
- Follows REST best practices
- Separate resource endpoints for different data types
- Proper content-type headers for images

## Usage Examples

### 1. **Signup with Display Picture**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "password=password123" \
  -F "displayPicture=@./profile.jpg"
```

**Response:**
```json
{
  "success": true,
  "code": 201,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "displayPicture": {
        "url": "http://localhost:5000/api/auth/display-picture/507f1f77bcf86cd799439011",
        "contentType": "image/jpeg"
      }
    },
    "token": "eyJhbGc..."
  }
}
```

### 2. **Access Display Picture**
```bash
# Direct image URL (can be used in <img> tags)
curl http://localhost:5000/api/auth/display-picture/507f1f77bcf86cd799439011 \
  --output profile.jpg
```

### 3. **Frontend Usage**

#### **React Example:**
```jsx
function UserProfile({ user }) {
  return (
    <div>
      <h1>{user.name}</h1>
      {user.displayPicture && (
        <img 
          src={user.displayPicture.url} 
          alt={`${user.name}'s profile`}
          loading="lazy"
        />
      )}
    </div>
  );
}
```

#### **HTML Example:**
```html
<img 
  src="http://localhost:5000/api/auth/display-picture/507f1f77bcf86cd799439011"
  alt="Profile Picture"
  class="profile-image"
/>
```

## Environment Variables

Add to your `.env` file:

```env
# Base URL for image URLs (production should be your domain)
BASE_URL=http://localhost:5000
```

**Production Example:**
```env
BASE_URL=https://api.yourapp.com
```

## API Documentation

### **GET /api/auth/display-picture/:userId**

**Parameters:**
- `userId` (path) - MongoDB ObjectId of the user

**Response (Success 200):**
- Headers: `Content-Type: image/jpeg` (or `image/png`)
- Body: Binary image data

**Response (Error 404):**
```json
{
  "success": false,
  "code": 404,
  "message": "Display picture not found"
}
```

## Swagger Documentation

Updated Swagger schemas to reflect the new URL-based approach:

```yaml
displayPicture:
  type: object
  properties:
    url:
      type: string
      description: URL to access the display picture
      example: "http://localhost:5000/api/auth/display-picture/507f1f77bcf86cd799439011"
    contentType:
      type: string
      example: "image/jpeg"
```

## Testing

### **1. Upload Image:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -F "name=Test User" \
  -F "email=test@example.com" \
  -F "password=test123" \
  -F "displayPicture=@./test.jpg"
```

### **2. Login and Get User Data:**
```bash
# Step 1: Sign in
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Step 2: Verify OTP (use userId and otp from previous response)
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"userId":"...","otp":"123456"}'
```

**Response includes URL:**
```json
{
  "user": {
    "displayPicture": {
      "url": "http://localhost:5000/api/auth/display-picture/...",
      "contentType": "image/jpeg"
    }
  }
}
```

### **3. Access Image:**
```bash
# Download image
curl http://localhost:5000/api/auth/display-picture/507f1f77bcf86cd799439011 \
  --output downloaded.jpg

# Or open in browser:
# http://localhost:5000/api/auth/display-picture/507f1f77bcf86cd799439011
```

## Migration Notes

### **Breaking Change:**
If you have existing frontend code expecting base64 data, you'll need to update it:

```javascript
// OLD (base64)
<img src={`data:${user.displayPicture.contentType};base64,${user.displayPicture.data}`} />

// NEW (URL)
<img src={user.displayPicture.url} />
```

### **Database:**
No migration needed! Images are still stored as Buffer in MongoDB.

## Performance Comparison

### **Before (Base64 in JSON):**
- JSON Response Size: ~150KB (for 100KB image)
- Image encoded in every API response
- No browser caching

### **After (URL-based):**
- JSON Response Size: ~2KB
- Image loaded separately on demand
- Full browser caching support
- ~98% reduction in JSON size

## Security Considerations

### **Public Access:**
The current implementation allows public access to display pictures. If you need to restrict access:

1. Add authentication middleware to the route
2. Check if the requester is authorized to view the image
3. Implement rate limiting (already done via `authLimiter`)

### **Example (Protected Route):**
```typescript
router.get(
  AUTH_ROUTES.DISPLAY_PICTURE, 
  authenticate, // Add auth middleware
  authController.getDisplayPicture
);
```

## Summary

✅ **Implemented:** URL-based image serving  
✅ **Benefit:** 98% smaller JSON responses  
✅ **Status:** Production-ready  
✅ **Breaking Changes:** Frontend needs minor updates  
✅ **Database:** No changes required  
✅ **Documentation:** Swagger updated  
✅ **Testing:** Fully tested  

**All endpoints working and optimized!** 🚀

