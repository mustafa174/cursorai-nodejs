import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, VALIDATION_MESSAGES } from '../constants/messages';

interface TypedRequestBody<T> extends Request {
  body: T;
}

class AuthController {
  /**
   * @route   POST /api/auth/signup
   * @desc    Register a new user
   * @access  Public
   */
  async signup(
    req: TypedRequestBody<{
      name: string;
      email: string;
      password: string;
      phone?: string;
      address?: string;
      country?: string;
    }>,
    res: Response
  ): Promise<Response> {
    try {
      const { name, email, password, phone, address, country } = req.body;

      // Validate input
      if (!name || !email || !password) {
        return sendError(res, HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
      }

      // Handle file upload
      const file = (req as any).file;
      let displayPicture;
      if (file) {
        displayPicture = {
          data: file.buffer,
          contentType: file.mimetype,
        };
      }

      // Create user
      const { user, token } = await authService.signup({
        name,
        email,
        password,
        phone,
        address,
        country,
        displayPicture,
      });

      return sendSuccess(res, HTTP_STATUS.CREATED, SUCCESS_MESSAGES.USER_REGISTERED, {
        user,
        token,
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      return sendError(res, HTTP_STATUS.BAD_REQUEST, error.message || ERROR_MESSAGES.SIGNUP_FAILED);
    }
  }

  /**
   * @route   POST /api/auth/signin
   * @desc    Sign in user - Generate OTP for verification
   * @access  Public
   */
  async signin(
    req: TypedRequestBody<{ email: string; password: string }>,
    res: Response
  ): Promise<Response> {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return sendError(res, HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_EMAIL_PASSWORD);
      }

      // Sign in user - get OTP instead of token
      const { userId, otp } = await authService.signin({ email, password });

      return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.OTP_GENERATED, {
        userId,
        otp, // Return OTP for local development
      });
    } catch (error: any) {
      console.error('Signin error:', error);
      return sendError(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        error.message || ERROR_MESSAGES.SIGNIN_FAILED
      );
    }
  }

  /**
   * @route   POST /api/auth/forgot-password
   * @desc    Request password reset
   * @access  Public
   */
  async forgotPassword(req: TypedRequestBody<{ email: string }>, res: Response): Promise<Response> {
    try {
      const { email } = req.body;

      // Validate input
      if (!email) {
        return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.EMAIL_REQUIRED);
      }

      await authService.requestPasswordReset(email);

      return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.PASSWORD_RESET_REQUESTED);
    } catch (error: any) {
      console.error('Forgot password error:', error);
      return sendError(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.PASSWORD_RESET_REQUEST_FAILED
      );
    }
  }

  /**
   * @route   POST /api/auth/reset-password
   * @desc    Reset password with token
   * @access  Public
   */
  async resetPassword(
    req: TypedRequestBody<{ token: string; newPassword: string }>,
    res: Response
  ): Promise<Response> {
    try {
      const { token, newPassword } = req.body;

      // Validate input
      if (!token || !newPassword) {
        return sendError(res, HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
      }

      if (newPassword.length < 6) {
        return sendError(res, HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_PASSWORD);
      }

      await authService.resetPassword(token, newPassword);

      return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS);
    } catch (error: any) {
      console.error('Reset password error:', error);
      return sendError(
        res,
        HTTP_STATUS.BAD_REQUEST,
        error.message || ERROR_MESSAGES.PASSWORD_RESET_FAILED
      );
    }
  }

  /**
   * @route   POST /api/auth/generate-otp
   * @desc    Generate and send OTP
   * @access  Public
   */
  async generateOTP(req: TypedRequestBody<{ email: string }>, res: Response): Promise<Response> {
    try {
      const { email } = req.body;

      // Validate input
      if (!email) {
        return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.EMAIL_REQUIRED);
      }

      await authService.generateOTP(email);

      return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.OTP_SENT);
    } catch (error: any) {
      console.error('Generate OTP error:', error);
      return sendError(
        res,
        HTTP_STATUS.BAD_REQUEST,
        error.message || ERROR_MESSAGES.OTP_GENERATION_FAILED
      );
    }
  }

  /**
   * @route   POST /api/auth/verify-otp
   * @desc    Verify OTP and issue JWT token
   * @access  Public
   */
  async verifyOTP(
    req: TypedRequestBody<{ userId: string; otp: string }>,
    res: Response
  ): Promise<Response> {
    try {
      const { userId, otp } = req.body;

      // Validate input
      if (!userId || !otp) {
        return sendError(res, HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
      }

      // Verify OTP and get token
      const { user, token } = await authService.verifyOTP(userId, otp);

      return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.OTP_VERIFIED, {
        token,
        user,
      });
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      return sendError(
        res,
        HTTP_STATUS.BAD_REQUEST,
        error.message || ERROR_MESSAGES.OTP_VERIFICATION_FAILED
      );
    }
  }

  /**
   * @route   GET /api/auth/display-picture/:userId
   * @desc    Get user's display picture
   * @access  Public
   */
  async getDisplayPicture(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = (req as any).params;

      const user = await authService.getUserById(userId);

      if (!user || !user.displayPicture?.data) {
        (res as any).status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          code: HTTP_STATUS.NOT_FOUND,
          message: ERROR_MESSAGES.DISPLAY_PICTURE_NOT_FOUND,
        });
        return;
      }

      // Set content type and send image buffer
      res.contentType(user.displayPicture.contentType);
      res.send(user.displayPicture.data);
    } catch (error: any) {
      console.error('Get display picture error:', error);
      (res as any).status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        code: HTTP_STATUS.BAD_REQUEST,
        message: error.message || ERROR_MESSAGES.DISPLAY_PICTURE_RETRIEVAL_FAILED,
      });
    }
  }
}

export default new AuthController();
