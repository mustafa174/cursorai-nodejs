import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { AUTH_ROUTES } from '../constants/routes';
import {
  signupValidation,
  signinValidation,
  emailValidation,
  resetPasswordValidation,
  otpValidation,
  handleValidationErrors,
} from '../middleware/validation.middleware';
import {
  authLimiter,
  otpLimiter,
  passwordResetLimiter,
} from '../middleware/rateLimiter.middleware';
import { uploadDisplayPicture } from '../middleware/upload.middleware';

const router = Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: password123
 *               phone:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 20
 *                 example: "+1-234-567-8900"
 *                 description: Optional. Numbers, spaces, and valid chars (+, -, (), spaces)
 *               address:
 *                 type: string
 *                 maxLength: 200
 *                 example: "123 Main Street, Apt 4B"
 *                 description: Optional. Max 200 characters
 *               country:
 *                 type: string
 *                 maxLength: 100
 *                 example: "United States"
 *                 description: Optional. Letters, spaces, and hyphens only
 *               displayPicture:
 *                 type: string
 *                 format: binary
 *                 description: Optional. Upload image file (JPG, JPEG, PNG only, max 10MB)
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: number
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: User registered successfully. Please verify your email with the OTP sent.
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439011
 *                         name:
 *                           type: string
 *                           example: John Doe
 *                         email:
 *                           type: string
 *                           example: john@example.com
 *                         phone:
 *                           type: string
 *                           example: "+1-234-567-8900"
 *                         address:
 *                           type: string
 *                           example: "123 Main Street, Apt 4B"
 *                         country:
 *                           type: string
 *                           example: "United States"
 *                         displayPicture:
 *                           type: object
 *                           properties:
 *                             url:
 *                               type: string
 *                               description: URL to access the display picture
 *                               example: "http://localhost:5000/api/auth/display-picture/507f1f77bcf86cd799439011"
 *                             contentType:
 *                               type: string
 *                               example: "image/jpeg"
 *                         isEmailVerified:
 *                           type: boolean
 *                           example: false
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Validation failed or bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 code:
 *                   type: number
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Validation failed
 *                 error:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: field
 *                       value:
 *                         type: string
 *                         example: "12345"
 *                       msg:
 *                         type: string
 *                         example: "Phone must be between 6 and 20 characters"
 *                       path:
 *                         type: string
 *                         example: phone
 *                       location:
 *                         type: string
 *                         example: body
 */

router.post(
  AUTH_ROUTES.SIGNUP,
  authLimiter,
  uploadDisplayPicture,
  signupValidation,
  handleValidationErrors,
  authController.signup
);

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Sign in user - Generate OTP for verification
 *     description: Verify credentials and generate OTP. Complete login with /verify-otp endpoint.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: OTP generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: OTP generated successfully. Please verify to complete login.
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     otp:
 *                       type: string
 *                       example: "123456"
 *                       description: OTP for local development (will not be returned in production)
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  AUTH_ROUTES.SIGNIN,
  authLimiter,
  signinValidation,
  handleValidationErrors,
  authController.signin
);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.post(
  AUTH_ROUTES.FORGOT_PASSWORD,
  passwordResetLimiter,
  emailValidation,
  handleValidationErrors,
  authController.forgotPassword
);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 example: abc123def456...
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  AUTH_ROUTES.RESET_PASSWORD,
  resetPasswordValidation,
  handleValidationErrors,
  authController.resetPassword
);

/**
 * @swagger
 * /api/auth/generate-otp:
 *   post:
 *     summary: Generate and send OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: OTP sent to email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.post(
  AUTH_ROUTES.GENERATE_OTP,
  otpLimiter,
  emailValidation,
  handleValidationErrors,
  authController.generateOTP
);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP and complete login
 *     description: Verify the OTP received from signin endpoint and receive JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - otp
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *                 description: User ID received from signin endpoint
 *               otp:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 example: "123456"
 *                 description: 6-digit OTP received from signin
 *     responses:
 *       200:
 *         description: OTP verified successfully. Login complete.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: OTP verified successfully. Login complete.
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  AUTH_ROUTES.VERIFY_OTP,
  otpValidation,
  handleValidationErrors,
  authController.verifyOTP
);

/**
 * @swagger
 * /api/auth/display-picture/{userId}:
 *   get:
 *     summary: Get user's display picture
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Image file
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Display picture not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(AUTH_ROUTES.DISPLAY_PICTURE, authController.getDisplayPicture);

export default router;
