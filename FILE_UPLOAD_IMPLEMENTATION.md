# ✅ File Upload with Multer - Implementation Complete

## 📋 Overview

Updated user registration and login to support file uploads using Multer. Images are stored as Buffers directly in MongoDB and returned as base64-encoded strings in API responses.

## 🆕 What Changed

### 1. **User Model Updated**

**`displayPicture` field changed from String to Object:**

```typescript
displayPicture?: {
  data: Buffer;        // Image binary data
  contentType: string; // MIME type (image/jpeg, image/png)
}
```

### 2. **Multer Middleware Created**

**File:** `src/middleware/upload.middleware.ts`

**Features:**
- ✅ Memory storage (stores file in memory as Buffer)
- ✅ File type validation (JPG, JPEG, PNG only)
- ✅ File size validation (max 10MB)
- ✅ Single file upload with field name `displayPicture`

**Configuration:**
```typescript
- Storage: Memory (multer.memoryStorage())
- Max Size: 10MB (10 * 1024 * 1024 bytes)
- Allowed Types: image/jpeg, image/jpg, image/png
- Field Name: "displayPicture"
```

### 3. **Registration Endpoint Updated**

**Request Format Changed:**
- **Before:** `application/json`
- **After:** `multipart/form-data`

**Now Accepts:**
- Text fields: name, email, password, phone, address, country
- File field: displayPicture (optional)

### 4. **Image Storage**

**MongoDB Storage:**
- Image stored as Buffer in `displayPicture.data`
- Content type stored in `displayPicture.contentType`

**API Response:**
- Buffer converted to base64 string in JSON
- Content type included

## 📝 API Usage

### Signup with File Upload

**Endpoint:** `POST /api/auth/signup`

**Content-Type:** `multipart/form-data`

**Form Fields:**
```
name: "John Doe"
email: "john@example.com"
password: "password123"
phone: "+1-234-567-8900" (optional)
address: "123 Main Street" (optional)
country: "United States" (optional)
displayPicture: [file] (optional, JPG/JPEG/PNG, max 10MB)
```

### Using cURL

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "password=password123" \
  -F "phone=+1-234-567-8900" \
  -F "address=123 Main Street" \
  -F "country=United States" \
  -F "displayPicture=@/path/to/image.jpg"
```

### Using Postman

1. **Method:** POST
2. **URL:** `http://localhost:5000/api/auth/signup`
3. **Body Tab:** Select "form-data"
4. **Add Fields:**
   - Key: `name`, Value: `John Doe`
   - Key: `email`, Value: `john@example.com`
   - Key: `password`, Value: `password123`
   - Key: `phone`, Value: `+1-234-567-8900`
   - Key: `address`, Value: `123 Main Street`
   - Key: `country`, Value: `United States`
   - Key: `displayPicture`, Type: `File`, Value: [Select image file]

### Using JavaScript/Fetch

```javascript
const formData = new FormData();
formData.append('name', 'John Doe');
formData.append('email', 'john@example.com');
formData.append('password', 'password123');
formData.append('phone', '+1-234-567-8900');
formData.append('address', '123 Main Street');
formData.append('country', 'United States');
formData.append('displayPicture', fileInput.files[0]); // File from input

const response = await fetch('http://localhost:5000/api/auth/signup', {
  method: 'POST',
  body: formData,
  // Don't set Content-Type header - browser will set it with boundary
});

const data = await response.json();
console.log(data);
```

## 📊 Response Format

### Successful Signup (201)

```json
{
  "success": true,
  "code": 201,
  "message": "User registered successfully. Please verify your email with the OTP sent.",
  "data": {
    "user": {
      "_id": "68f791e5576ebd5ee750503f",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1-234-567-8900",
      "address": "123 Main Street",
      "country": "United States",
      "displayPicture": {
        "data": "iVBORw0KGgoAAAANSUhEUgAA... [base64 encoded image]",
        "contentType": "image/jpeg"
      },
      "isEmailVerified": false,
      "createdAt": "2025-10-21T14:00:05.690Z",
      "updatedAt": "2025-10-21T14:00:05.751Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login Response (Includes All Fields)

After completing OTP verification:

```json
{
  "success": true,
  "code": 200,
  "message": "OTP verified successfully. Login complete.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "68f791e5576ebd5ee750503f",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1-234-567-8900",
      "address": "123 Main Street",
      "country": "United States",
      "displayPicture": {
        "data": "iVBORw0KGgoAAAANSUhEUgAA... [base64]",
        "contentType": "image/jpeg"
      },
      "isEmailVerified": true,
      "createdAt": "2025-10-21T14:00:05.690Z",
      "updatedAt": "2025-10-21T14:16:34.108Z"
    }
  }
}
```

## ⚠️ Error Responses

### Invalid File Type (400)

```json
{
  "success": false,
  "code": 400,
  "message": "Display picture must be JPG, JPEG, or PNG only"
}
```

### File Too Large (400)

```json
{
  "success": false,
  "code": 400,
  "message": "File too large"
}
```

### Validation Errors (400)

```json
{
  "success": false,
  "code": 400,
  "message": "Validation failed",
  "error": [
    {
      "msg": "Phone must be between 6 and 20 characters",
      "path": "phone"
    }
  ]
}
```

## 🔧 Technical Details

### Multer Configuration

```typescript
storage: multer.memoryStorage()
// Stores file in memory as Buffer (req.file.buffer)

limits: {
  fileSize: 10 * 1024 * 1024  // 10MB
}

fileFilter: (req, file, cb) => {
  // Validates MIME type
  if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Display picture must be JPG, JPEG, or PNG only'));
  }
}
```

### Middleware Order

```typescript
router.post(
  '/signup',
  authLimiter,              // 1. Rate limiting
  uploadDisplayPicture,     // 2. File upload (Multer)
  signupValidation,         // 3. Field validation
  handleValidationErrors,   // 4. Validation error handler
  authController.signup     // 5. Controller
);
```

### Buffer to Base64 Conversion

In User model's `toJSON` method:

```typescript
if (obj.displayPicture && obj.displayPicture.data) {
  obj.displayPicture = {
    data: obj.displayPicture.data.toString('base64'),
    contentType: obj.displayPicture.contentType,
  };
}
```

## 📚 Files Modified/Created

### Created
1. **`src/middleware/upload.middleware.ts`** - Multer configuration

### Modified
1. **`src/models/User.model.ts`**
   - Changed `displayPicture` from String to Object with Buffer
   - Added base64 conversion in toJSON method

2. **`src/services/auth.service.ts`**
   - Updated `SignupData` interface
   - Added optional fields support

3. **`src/controllers/auth.controller.ts`**
   - Handle file upload from request
   - Pass file buffer to service

4. **`src/routes/auth.routes.ts`**
   - Added `uploadDisplayPicture` middleware
   - Updated Swagger docs for multipart/form-data

5. **`src/middleware/validation.middleware.ts`**
   - Removed displayPicture validation (handled by Multer)

6. **`src/config/swagger.ts`**
   - Updated User schema for displayPicture object

## 🎯 Displaying Images in Frontend

### Decode Base64 to Image

```javascript
// Get user data from API
const user = response.data.user;

if (user.displayPicture) {
  const { data, contentType } = user.displayPicture;
  
  // Create data URL
  const imageUrl = `data:${contentType};base64,${data}`;
  
  // Display in img tag
  document.getElementById('avatar').src = imageUrl;
  
  // Or in React
  <img src={`data:${contentType};base64,${data}`} alt="Avatar" />
}
```

### Download Image

```javascript
const downloadImage = (displayPicture) => {
  const { data, contentType } = displayPicture;
  
  // Convert base64 to blob
  const byteCharacters = atob(data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: contentType });
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'profile-picture.jpg';
  a.click();
};
```

## ✅ Testing Checklist

- [x] Multer installed and configured
- [x] User model updated with Buffer storage
- [x] Upload middleware created
- [x] Signup route updated
- [x] Controller handles file upload
- [x] Service stores image buffer
- [x] Base64 conversion in JSON response
- [x] Swagger documentation updated
- [x] File type validation works
- [x] File size validation works
- [x] Login returns all user details
- [x] No TypeScript errors
- [x] Server running successfully

## 🎉 Summary

- ✅ File uploads working with Multer
- ✅ Images stored as Buffers in MongoDB
- ✅ Validation for file type and size
- ✅ Base64 encoding in API responses
- ✅ All user details returned in login
- ✅ Swagger documentation updated
- ✅ Support for multipart/form-data
- ✅ Optional file upload (not required)

**Status: ✅ COMPLETE AND WORKING!**

Upload images via Swagger UI at: `http://localhost:5000/api-docs` 🚀

