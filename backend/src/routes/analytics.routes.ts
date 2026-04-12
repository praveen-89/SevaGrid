import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { AnalyticsController } from '../controllers/AnalyticsController';
import { UserRole } from '../constants';

const router = Router();

// Lock boundary down globally
router.use(requireAuth);

// Analytics payloads are strictly locked up to NGO Administrators only
router.get('/overview', requireRole(UserRole.ADMIN), AnalyticsController.getOverview);

export default router;
