import multer from 'multer';
import { Request } from 'express';
import { VALIDATION_MESSAGES } from '../constants/messages';

/**
 * Allowed image MIME types
 */
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

/**
 * Maximum file size: 10MB
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

/**
 * Multer configuration for storing files in memory
 */
const storage = multer.memoryStorage();

/**
 * File filter to validate image type
 */
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check if file type is allowed
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(VALIDATION_MESSAGES.DISPLAY_PICTURE_TYPE));
  }
};

/**
 * Multer upload configuration
 */
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: fileFilter,
});

/**
 * Middleware for single file upload
 * Field name: 'displayPicture'
 */
export const uploadDisplayPicture = upload.single('displayPicture');
