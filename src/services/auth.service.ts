import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.model';
import config from '../config/env';
import emailService from '../utils/email';
import { generateOTP, generateResetToken } from '../utils/generateOTP';
import { ERROR_MESSAGES } from '../constants/messages';

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  country?: string;
  displayPicture?: {
    data: Buffer;
    contentType: string;
  };
}

interface SigninData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: IUser;
  token: string;
}

interface SigninResponse {
  userId: string;
  otp: string;
}

interface VerifyOTPResponse {
  user: IUser;
  token: string;
}

class AuthService {
  /**
   * Generate JWT token
   */
  private generateToken(userId: string): string {
    return jwt.sign({ userId }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    } as jwt.SignOptions);
  }

  /**
   * Register a new user
   */
  async signup(data: SignupData): Promise<AuthResponse> {
    const { name, email, password, phone, address, country, displayPicture } = data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone,
      address,
      country,
      displayPicture,
    });

    await user.save();

    // Generate OTP for email verification
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + config.otpExpiresIn);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send verification email
    try {
      await emailService.sendOTPEmail(email, otp);
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }

    // Generate token
    const token = this.generateToken(String(user._id));

    return { user, token };
  }

  /**
   * Sign in user - Generate OTP instead of immediate JWT
   */
  async signin(data: SigninData): Promise<SigninResponse> {
    const { email, password } = data;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Generate OTP for login verification
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // In production, send OTP via email
    // For local development, return OTP in response
    try {
      await emailService.sendOTPEmail(email, otp);
    } catch (error) {
      console.error('Failed to send OTP email:', error);
    }

    return {
      userId: String(user._id),
      otp, // Return OTP for local development
    };
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal that user doesn't exist for security
      return;
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const resetTokenExpires = new Date(Date.now() + config.resetTokenExpiresIn);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    // Send reset email
    try {
      await emailService.sendPasswordResetEmail(email, resetToken);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error(ERROR_MESSAGES.EMAIL_SEND_FAILED);
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      throw new Error(ERROR_MESSAGES.INVALID_TOKEN);
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  }

  /**
   * Generate and send OTP
   */
  async generateOTP(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + config.otpExpiresIn);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP email
    try {
      await emailService.sendOTPEmail(email, otp);
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      throw new Error(ERROR_MESSAGES.EMAIL_SEND_FAILED);
    }
  }

  /**
   * Verify OTP and issue JWT token
   */
  async verifyOTP(userId: string, otp: string): Promise<VerifyOTPResponse> {
    const user = await User.findById(userId).select('+otp +otpExpires');

    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (!user.otp || !user.otpExpires) {
      throw new Error(ERROR_MESSAGES.OTP_NOT_FOUND);
    }

    if (user.otpExpires < new Date()) {
      throw new Error(ERROR_MESSAGES.OTP_EXPIRED);
    }

    if (user.otp !== otp) {
      throw new Error(ERROR_MESSAGES.INVALID_OTP);
    }

    // Mark email as verified (if not already)
    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = this.generateToken(String(user._id));

    // Send welcome email if first time verification
    try {
      await emailService.sendWelcomeEmail(user.email, user.name);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }

    return { user, token };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, config.jwtSecret);
    } catch (error) {
      throw new Error(ERROR_MESSAGES.INVALID_TOKEN);
    }
  }
}

export default new AuthService();
