# Node.js TypeScript REST API Boilerplate

A production-ready Node.js REST API boilerplate built with TypeScript, Express, MongoDB, and Clean Architecture principles.

## 🚀 Features

- **TypeScript**: Full type safety and modern JavaScript features
- **Express.js**: Fast, unopinionated web framework
- **MongoDB with Mongoose**: NoSQL database with elegant ODM
- **Clean Architecture**: Organized folder structure (controllers, services, models, middleware)
- **JWT Authentication**: Secure token-based authentication
- **Password Security**: Bcrypt password hashing
- **Email Integration**: Nodemailer for sending emails
- **OTP Verification**: 6-digit OTP for email verification and 2FA
- **Password Reset**: Two-step password reset flow with time-limited tokens
- **Rate Limiting**: Protection against brute-force attacks
- **Input Validation**: Express-validator for request validation
- **Error Handling**: Centralized error handling middleware
- **Security**: Helmet for security headers, CORS configuration
- **Environment Configuration**: Dotenv for environment variables
- **Standardized API Responses**: Consistent response format with pagination support
- **Swagger/OpenAPI Documentation**: Interactive API documentation with Swagger UI
- **405 Method Not Allowed Handler**: Proper HTTP 405 responses with Allow header for unsupported methods

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or remote instance)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository** (or use this boilerplate)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Copy `.env.example` to create a `.env` file
   - Update the values in `.env` with your configuration:
     - MongoDB connection string
     - JWT secret key
     - Email service credentials (Gmail, SendGrid, etc.)
     - CORS origin
     - Other configuration as needed

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

## 🚦 Running the Application

### Development Mode
```bash
npm run dev
```
This starts the server with hot-reload using tsx (faster than ts-node-dev).

Alternative (without watch mode):
```bash
npm run start:dev
```

### Production Mode
```bash
# Build TypeScript to JavaScript
npm run build

# Start the compiled JavaScript
npm start
```

The server will run on `http://localhost:5000` by default.

## 📚 API Documentation

Once the server is running, you can access the interactive Swagger API documentation at:

**http://localhost:5000/api-docs**

The Swagger UI provides:
- Complete API endpoint documentation
- Interactive API testing interface
- Request/response schema definitions
- Example requests and responses
- Authentication testing (JWT Bearer tokens)

You can also view the API documentation by visiting the root endpoint at `http://localhost:5000/`, which will show a summary of available endpoints.

### Testing with Swagger

1. **Start the server**: Run `npm run dev` or `npm start`
2. **Open Swagger UI**: Navigate to http://localhost:5000/api-docs
3. **Test endpoints**:
   - Click on any endpoint to expand it
   - Click "Try it out" button
   - Fill in the required parameters/body
   - Click "Execute" to send the request
   - View the response below

4. **Testing authenticated endpoints**:
   - First, sign up or sign in using the `/api/auth/signup` or `/api/auth/signin` endpoint
   - Copy the JWT token from the response
   - Click the "Authorize" button at the top of the Swagger UI
   - Enter: `Bearer YOUR_TOKEN_HERE` (include the word "Bearer" followed by a space)
   - Click "Authorize" and then "Close"
   - Now you can test protected endpoints

## 📁 Project Structure

```
nodejs-typescript-api-boilerplate/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.ts      # MongoDB connection
│   │   ├── db.ts            # MongoDB connection (main)
│   │   ├── env.ts           # Environment variables
│   │   └── swagger.ts       # Swagger/OpenAPI configuration
│   ├── constants/           # Application constants
│   │   └── routes.ts        # Route path constants
│   ├── controllers/         # Request handlers
│   │   └── auth.controller.ts
│   ├── middleware/          # Custom middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── methodNotAllowed.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── rateLimiter.middleware.ts
│   ├── models/              # Mongoose models
│   │   └── User.model.ts
│   ├── routes/              # API routes
│   │   ├── index.ts
│   │   └── auth.routes.ts
│   ├── services/            # Business logic
│   │   └── auth.service.ts
│   ├── utils/               # Utility functions
│   │   ├── email.ts
│   │   ├── generateOTP.ts
│   │   └── response.ts
│   ├── app.ts               # Express application
│   └── server.ts            # Server entry point
├── dist/                    # Compiled JavaScript (generated)
├── .env                     # Environment variables
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## 🔐 API Endpoints

### Authentication Routes (`/api/auth`)

**Important**: Login now requires two steps:
1. **Sign-in** (`POST /api/auth/signin`) - Verify credentials, get userId and OTP
2. **Verify OTP** (`POST /api/auth/verify-otp`) - Verify OTP, get JWT token

#### 1. **User Registration (Sign-up)**
- **Endpoint**: `POST /api/auth/signup`
- **Description**: Register a new user account
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1-234-567-8900",
    "address": "123 Main Street, Apt 4B",
    "country": "United States",
    "displayPicture": "https://example.com/avatar.jpg"
  }
  ```
  **Required fields:** `name`, `email`, `password`
  
  **Optional fields:**
  - `phone` (6-20 characters, numbers and valid chars: `+`, `-`, `()`, spaces)
  - `address` (max 200 characters)
  - `country` (max 100 characters, letters, spaces, hyphens only)
  - `displayPicture` (JPG/JPEG/PNG only, max 10MB, URL or file)

- **Response**:
  ```json
  {
    "success": true,
    "message": "User registered successfully. Please verify your email with the OTP sent.",
    "data": {
      "user": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1-234-567-8900",
        "address": "123 Main Street, Apt 4B",
        "country": "United States",
        "displayPicture": "https://example.com/avatar.jpg",
        "isEmailVerified": false
      },
      "token": "jwt_token_here"
    }
  }
  ```

#### 2. **User Sign-in (Step 1: Generate OTP)**
- **Endpoint**: `POST /api/auth/signin`
- **Description**: Verify credentials and generate OTP for login verification
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "OTP generated successfully. Please verify to complete login.",
    "data": {
      "userId": "68f78b723042a7d624fd8ad8",
      "otp": "380163"
    }
  }
  ```
- **Note**: OTP is valid for 5 minutes. In production, OTP is sent via email only.

#### 3. **Forgot Password (Request Reset)**
- **Endpoint**: `POST /api/auth/forgot-password`
- **Description**: Request a password reset link via email
- **Request Body**:
  ```json
  {
    "email": "john@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "If the email exists, a password reset link has been sent"
  }
  ```

#### 4. **Reset Password**
- **Endpoint**: `POST /api/auth/reset-password`
- **Description**: Reset password using the token from email
- **Request Body**:
  ```json
  {
    "token": "reset_token_from_email",
    "newPassword": "newPassword123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Password reset successfully"
  }
  ```

#### 5. **Generate OTP**
- **Endpoint**: `POST /api/auth/generate-otp`
- **Description**: Generate and send a 6-digit OTP to email
- **Request Body**:
  ```json
  {
    "email": "john@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "OTP sent to your email"
  }
  ```

#### 6. **Verify OTP (Step 2: Complete Login)**
- **Endpoint**: `POST /api/auth/verify-otp`
- **Description**: Verify the OTP received from signin and receive JWT token
- **Request Body**:
  ```json
  {
    "userId": "68f78b723042a7d624fd8ad8",
    "otp": "380163"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "OTP verified successfully. Login complete.",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "_id": "68f78b723042a7d624fd8ad8",
        "name": "John Doe",
        "email": "john@example.com",
        "isEmailVerified": true,
        "createdAt": "2025-10-21T13:32:34.236Z",
        "updatedAt": "2025-10-21T13:44:34.108Z"
      }
    }
  }
  ```
- **Note**: Use userId and OTP received from the signin endpoint. Email is automatically marked as verified.

### General Routes

#### Health Check
- **Endpoint**: `GET /api/health`
- **Description**: Check if the server is running
- **Response**:
  ```json
  {
    "success": true,
    "message": "Server is running",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
  ```

## 🔒 Authentication Flow

### Registration and Email Verification
1. User registers with `POST /api/auth/signup`
2. System sends a 6-digit OTP to the user's email
3. User verifies email with `POST /api/auth/verify-otp`
4. Account is activated

### Password Reset
1. User requests reset with `POST /api/auth/forgot-password`
2. System sends a reset link with a unique token to email
3. User clicks link and submits new password to `POST /api/auth/reset-password`
4. Password is updated

### Protected Routes
1. User signs in and receives JWT token
2. Include token in request headers: `Authorization: Bearer <token>`
3. Middleware validates token and attaches user to request

## 🛡️ Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: Stateless authentication
- **Rate Limiting**: Prevents brute-force attacks
  - General: 100 requests per 15 minutes
  - Auth endpoints: 5 requests per 15 minutes
  - OTP: 3 requests per 15 minutes
  - Password reset: 3 requests per hour
- **Input Validation**: Express-validator for all inputs
- **Helmet**: Security headers
- **CORS**: Configurable cross-origin resource sharing
- **Token Expiration**: Time-limited reset tokens and OTPs

## ⚠️ Error Responses

The API returns consistent error responses for better client handling:

### 405 Method Not Allowed
When a route exists but the HTTP method is not supported:
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
**Headers:** `Allow: GET` (lists allowed methods)

**Example:**
```bash
curl -X POST http://localhost:5000/api/health
# Returns 405 because /api/health only supports GET
```

### 404 Not Found
When a route does not exist:
```json
{
  "success": false,
  "code": 404,
  "message": "Route /api/non-existent not found"
}
```

### 400 Bad Request
When validation fails or input is invalid:
```json
{
  "success": false,
  "code": 400,
  "message": "Validation failed",
  "error": [
    {
      "type": "field",
      "value": "invalid-value",
      "msg": "Phone must be between 6 and 20 characters",
      "path": "phone",
      "location": "body"
    }
  ]
}
```

**Common validation errors:**
- `Phone must be between 6 and 20 characters`
- `Display picture must be JPG, JPEG, or PNG only`
- `Display picture URL must end with .jpg, .jpeg, or .png`
- `Address must not exceed 200 characters`
- `Country must not exceed 100 characters`
- `Country must contain only letters, spaces, and hyphens`

### 401 Unauthorized
When authentication fails or token is invalid:
```json
{
  "success": false,
  "code": 401,
  "message": "Invalid email or password"
}
```

## 📧 Email Configuration

This boilerplate uses Nodemailer. Configure your email service in `.env`:

### Gmail Example
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourapp.com
```

**Note**: For Gmail, you may need to:
- Enable "Less secure app access" OR
- Use an "App Password" (recommended for 2FA-enabled accounts)

### Other Email Services
- **SendGrid**: Update host to `smtp.sendgrid.net`
- **Mailgun**: Update host to `smtp.mailgun.org`
- **AWS SES**: Update host to your SES SMTP endpoint

## 🧪 Testing the API

You can test the API using:
- **Postman**: Import the endpoints and test
- **cURL**: Command-line testing
- **Thunder Client** (VS Code extension)

### Example cURL Request
```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Sign in
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Verify OTP
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","otp":"123456"}'
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/userTestingCursor` |
| `JWT_SECRET` | Secret key for JWT | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `RESET_TOKEN_EXPIRES_IN` | Password reset token expiry (ms) | `3600000` (1 hour) |
| `OTP_EXPIRES_IN` | OTP expiration time (ms) | `600000` (10 minutes) |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_SECURE` | Use TLS | `false` |
| `EMAIL_USER` | Email username | Required |
| `EMAIL_PASSWORD` | Email password | Required |
| `EMAIL_FROM` | From email address | `noreply@yourapp.com` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

## 📝 Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 📤 API Response Format

All API responses follow a standardized format for consistency:

### Success Response
```json
{
  "success": true,
  "code": 200,
  "message": "Operation successful",
  "data": { ... },
  "count": 10,           // Auto-added for arrays
  "pagination": {        // Optional, for paginated data
    "page": 1,
    "limit": 10,
    "totalItems": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error Response
```json
{
  "success": false,
  "code": 400,
  "message": "Error message",
  "error": { ... }       // Optional error details
}
```

### Usage Example
```typescript
import { successResponse, errorResponse } from '../utils/response';

// Simple success
return successResponse(res, 200, 'User created', user);

// With pagination
return successResponse(res, 200, 'Users retrieved', users, {
  page: 1,
  limit: 10,
  totalItems: 100
});

// Error
return errorResponse(res, 400, 'Invalid email');
```

**📚 For detailed examples, see:** `RESPONSE_UTILITY_GUIDE.md`

## 📝 Route Constants

All route paths are centralized in `src/constants/routes.ts` for easy maintenance:

```typescript
export const AUTH_ROUTES = {
  BASE: '/auth',
  SIGNUP: '/signup',
  SIGNIN: '/signin',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  GENERATE_OTP: '/generate-otp',
  VERIFY_OTP: '/verify-otp',
};

// Full route paths available in FULL_ROUTES object
```

This approach:
- ✅ Centralizes route management
- ✅ Prevents typos and inconsistencies
- ✅ Makes route refactoring easier
- ✅ Improves code maintainability

## 🚀 Extending the Boilerplate

This boilerplate focuses on authentication. You can easily extend it with:

### Adding New Features
1. **User Profile Management** - Add CRUD operations for user profiles
2. **Role-Based Access Control (RBAC)** - Implement admin/user roles
3. **File Upload** - Add avatar/document upload functionality
4. **More Models** - Products, Posts, Comments, etc.
5. **Payments** - Integrate Stripe or PayPal
6. **Real-time** - Add Socket.io for real-time features
7. **Testing** - Add unit and integration tests with Jest

### Example: Adding a New Module
```typescript
// 1. Create model: src/models/Product.model.ts
// 2. Create service: src/services/product.service.ts
// 3. Create controller: src/controllers/product.controller.ts
// 4. Create routes: src/routes/product.routes.ts
// 5. Add route constants to: src/constants/routes.ts
// 6. Import in: src/routes/index.ts
```

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📄 License

MIT License - feel free to use this boilerplate for your projects!

## 🙏 Acknowledgments

Built with:
- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)
- [Nodemailer](https://nodemailer.com/)

---

**Happy Coding! 🚀**

