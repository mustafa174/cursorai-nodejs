/**
 * Mock Data for Tests
 */

export const mockUser = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedPassword123',
  phone: '+1-234-567-8900',
  address: '123 Test Street',
  country: 'Test Country',
  isEmailVerified: false,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  comparePassword: jest.fn(),
  toJSON: jest.fn(),
  save: jest.fn(),
};

export const mockUserInput = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  phone: '+1-234-567-8900',
  address: '123 Test Street',
  country: 'Test Country',
};

export const mockSigninData = {
  email: 'test@example.com',
  password: 'password123',
};

export const mockOTP = '123456';

export const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';

export const mockResetToken = 'reset-token-123456';

export const mockDisplayPicture = {
  data: Buffer.from('test image data'),
  contentType: 'image/jpeg',
};

export const mockFile = {
  fieldname: 'displayPicture',
  originalname: 'test.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer: Buffer.from('test image data'),
  size: 1024,
};

export const mockRequest = (body: any = {}, params: any = {}, headers: any = {}) => ({
  body,
  params,
  headers,
  file: undefined,
  user: undefined,
  originalUrl: '',
  path: '',
  method: 'GET',
  get: jest.fn((header: string) => headers[header]),
});

export const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  res.contentType = jest.fn().mockReturnValue(res);
  return res;
};

export const mockNext = jest.fn();
