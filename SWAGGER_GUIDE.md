# Swagger API Documentation Guide

## 📚 Overview

This project includes comprehensive Swagger/OpenAPI documentation for all API endpoints. Swagger provides an interactive interface to explore, test, and understand the API.

## 🚀 Accessing Swagger UI

Once your server is running:

```
http://localhost:5000/api-docs
```

## 🎯 Features

### 1. **Interactive API Explorer**
- Browse all available endpoints organized by tags
- View detailed request/response schemas
- See example values for all fields

### 2. **Live API Testing**
- Test endpoints directly from the browser
- No need for external tools like Postman
- Instant response viewing

### 3. **Authentication Support**
- Built-in JWT Bearer token authentication
- Easy authorization for protected endpoints
- Persistent token storage during session

### 4. **Schema Definitions**
- Complete request body schemas
- Response object definitions
- Data type specifications

## 📖 How to Use

### Testing Public Endpoints

1. Navigate to http://localhost:5000/api-docs
2. Find the endpoint you want to test (e.g., `/api/auth/signup`)
3. Click on the endpoint to expand it
4. Click the **"Try it out"** button
5. Fill in the request body with your data:
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123"
   }
   ```
6. Click **"Execute"**
7. View the response below:
   - Response status code
   - Response body
   - Response headers

### Testing Protected Endpoints

Some endpoints require authentication. Here's how to test them:

#### Step 1: Get a JWT Token
1. Use the `/api/auth/signup` or `/api/auth/signin` endpoint
2. Copy the token from the response:
   ```json
   {
     "success": true,
     "data": {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     }
   }
   ```

#### Step 2: Authorize in Swagger
1. Click the **"Authorize"** button (lock icon) at the top right
2. In the "bearerAuth" section, enter:
   ```
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   ⚠️ **Important**: Include the word "Bearer" followed by a space, then your token
3. Click **"Authorize"**
4. Click **"Close"**

#### Step 3: Test Protected Endpoints
Now you can test any endpoint that requires authentication. The token will be automatically included in the request headers.

## 🔍 Available Endpoints

### Authentication (`/api/auth`)

- **POST /api/auth/signup** - Register a new user
- **POST /api/auth/signin** - Sign in and get JWT token
- **POST /api/auth/forgot-password** - Request password reset
- **POST /api/auth/reset-password** - Reset password with token
- **POST /api/auth/generate-otp** - Generate OTP for email verification
- **POST /api/auth/verify-otp** - Verify OTP code

### Health Check (`/api`)

- **GET /api/health** - Check server status

## 💡 Tips

1. **Use Example Values**: Each endpoint includes example values you can use as a template
2. **Check Schemas**: Click on "Schema" tab to see the complete data structure
3. **Response Codes**: Each endpoint shows all possible response codes (200, 400, 401, etc.)
4. **Validation**: The UI will show validation errors if required fields are missing
5. **Token Expiry**: If you get 401 errors, your token may have expired - sign in again

## 🛠️ Configuration

The Swagger configuration is located in:
```
src/config/swagger.ts
```

You can customize:
- API title and description
- Server URLs (development, production)
- Contact information
- License details
- Security schemes

## 📝 Adding Documentation to New Endpoints

When adding new endpoints, use JSDoc comments with Swagger annotations:

```typescript
/**
 * @swagger
 * /api/your-endpoint:
 *   post:
 *     summary: Your endpoint description
 *     tags: [YourTag]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field1:
 *                 type: string
 *                 example: "value"
 *     responses:
 *       200:
 *         description: Success response
 */
router.post('/your-endpoint', yourController);
```

## 🔗 Additional Resources

- [Swagger Documentation](https://swagger.io/docs/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)
- [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)

## 🎨 Customization

The Swagger UI has been customized with:
- Hidden top bar for cleaner look
- Custom site title
- Explorer enabled for better navigation

You can modify these settings in `src/app.ts` where Swagger UI is initialized.

