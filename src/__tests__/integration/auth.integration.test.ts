/**
 * Integration Tests for Auth API
 * These tests verify the complete flow of authentication endpoints
 */

import request from 'supertest';
import app from '../../app';
import User from '../../models/User.model';
import { HTTP_STATUS } from '../../constants/httpStatus';

// Mock mongoose and external services
jest.mock('../../models/User.model');
jest.mock('../../utils/email');
jest.mock('../../config/db', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(true),
}));

describe('Auth API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Test User',
        email: 'test@example.com',
        isEmailVerified: false,
        toJSON: jest.fn().mockReturnValue({
          _id: '507f1f77bcf86cd799439011',
          name: 'Test User',
          email: 'test@example.com',
          isEmailVerified: false,
        }),
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User as any).mockImplementation(() => ({
        ...mockUser,
        save: jest.fn().mockResolvedValue(mockUser),
      }));

      const response = await request(app).post('/api/auth/signup').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(HTTP_STATUS.CREATED);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
    });

    it('should return validation error for missing fields', async () => {
      const response = await request(app).post('/api/auth/signup').send({
        email: 'test@example.com',
        // Missing name and password
      });

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.success).toBe(false);
    });

    it('should reject duplicate email', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ email: 'existing@example.com' });

      const response = await request(app).post('/api/auth/signup').send({
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
    });
  });

  describe('POST /api/auth/signin', () => {
    it('should return OTP for valid credentials', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true),
      };

      (User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      const response = await request(app).post('/api/auth/signin').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.data).toHaveProperty('userId');
      expect(response.body.data).toHaveProperty('otp');
    });

    it('should reject invalid credentials', async () => {
      (User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      const response = await request(app).post('/api/auth/signin').send({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Server is running');
    });
  });

  describe('GET / (root)', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('404 Not Found', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/api/non-existent');

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body.success).toBe(false);
    });
  });

  describe('405 Method Not Allowed', () => {
    it('should return 405 for wrong HTTP methods', async () => {
      const response = await request(app).put('/api/auth/signin');

      expect(response.status).toBe(HTTP_STATUS.METHOD_NOT_ALLOWED);
      expect(response.body.success).toBe(false);
      expect(response.headers.allow).toBeDefined();
    });
  });
});
