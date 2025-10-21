import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import config from './config/env';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { generalLimiter } from './middleware/rateLimiter.middleware';
import { methodNotAllowedMiddleware } from './middleware/methodNotAllowed.middleware';
import { API_PREFIX, FULL_ROUTES } from './constants/routes';
import { HTTP_STATUS } from './constants/httpStatus';
import { INFO_MESSAGES } from './constants/messages';
import swaggerSpec from './config/swagger';

const app = express();

/**
 * Security Middleware
 */
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);

/**
 * Body Parser Middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Rate Limiting
 */
app.use(generalLimiter);

/**
 * Swagger Documentation
 */
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  })
);

/**
 * API Routes
 */
app.use(API_PREFIX, routes);

/**
 * Root endpoint
 */
app.get(FULL_ROUTES.ROOT, (_req: Request, res: Response) => {
  return (res as any).status(HTTP_STATUS.OK).json({
    success: true,
    message: INFO_MESSAGES.API_NAME,
    version: INFO_MESSAGES.API_VERSION,
    documentation: 'http://localhost:5000/api-docs',
    endpoints: {
      health: `GET ${FULL_ROUTES.HEALTH}`,
      auth: {
        signup: `POST ${FULL_ROUTES.AUTH_SIGNUP}`,
        signin: `POST ${FULL_ROUTES.AUTH_SIGNIN}`,
        forgotPassword: `POST ${FULL_ROUTES.AUTH_FORGOT_PASSWORD}`,
        resetPassword: `POST ${FULL_ROUTES.AUTH_RESET_PASSWORD}`,
        generateOTP: `POST ${FULL_ROUTES.AUTH_GENERATE_OTP}`,
        verifyOTP: `POST ${FULL_ROUTES.AUTH_VERIFY_OTP}`,
        displayPicture: `GET ${FULL_ROUTES.AUTH_DISPLAY_PICTURE}`,
      },
    },
  });
});

/**
 * Error Handling
 */
// Handle 405 Method Not Allowed (must be before 404 handler)
app.use(methodNotAllowedMiddleware(app));

// Handle 404 Not Found
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
