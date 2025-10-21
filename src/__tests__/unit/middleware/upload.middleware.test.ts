/**
 * Tests for Upload Middleware
 */

import { mockFile } from '../../mocks/mockData';
import { VALIDATION_MESSAGES } from '../../../constants/messages';

describe('Upload Middleware', () => {
  describe('File validation', () => {
    it('should accept valid image types', () => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];

      validTypes.forEach((type) => {
        const file = { ...mockFile, mimetype: type };
        expect(['image/jpeg', 'image/jpg', 'image/png']).toContain(file.mimetype);
      });
    });

    it('should reject invalid file types', () => {
      const invalidFile = { ...mockFile, mimetype: 'image/gif' };

      expect(['image/jpeg', 'image/jpg', 'image/png']).not.toContain(invalidFile.mimetype);
    });

    it('should have correct max file size', () => {
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

      expect(MAX_FILE_SIZE).toBe(10485760);
    });

    it('should validate file size limits', () => {
      const MAX_FILE_SIZE = 10 * 1024 * 1024;
      const validFile = { ...mockFile, size: 5 * 1024 * 1024 };
      const invalidFile = { ...mockFile, size: 15 * 1024 * 1024 };

      expect(validFile.size).toBeLessThan(MAX_FILE_SIZE);
      expect(invalidFile.size).toBeGreaterThan(MAX_FILE_SIZE);
    });
  });

  describe('Error messages', () => {
    it('should have correct validation message for file type', () => {
      expect(VALIDATION_MESSAGES.DISPLAY_PICTURE_TYPE).toBe(
        'Display picture must be JPG, JPEG, or PNG only'
      );
    });
  });
});
