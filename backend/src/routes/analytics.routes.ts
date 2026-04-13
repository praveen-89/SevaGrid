import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { AnalyticsController } from '../controllers/AnalyticsController';
import { UserRole } from '../constants';

const router = Router();

router.use(requireAuth);

router.get('/overview', requireRole(UserRole.ADMIN), AnalyticsController.getOverview);
router.get('/cases-by-status', requireRole(UserRole.ADMIN), AnalyticsController.getCasesByStatus);
router.get('/cases-by-category', requireRole(UserRole.ADMIN), AnalyticsController.getCasesByCategory);
router.get('/weekly-trend', requireRole(UserRole.ADMIN), AnalyticsController.getWeeklyTrend);

export default router;
