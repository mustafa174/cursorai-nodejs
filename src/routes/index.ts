import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes';
import { AUTH_ROUTES, GENERAL_ROUTES } from '../constants/routes';
import { HTTP_STATUS } from '../constants/httpStatus';

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Server is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-01-01T12:00:00.000Z
 */
router.get(GENERAL_ROUTES.HEALTH, (_req: Request, res: Response) => {
  (res as any).status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Authentication routes
 */
router.use(AUTH_ROUTES.BASE, authRoutes);

export default router;
