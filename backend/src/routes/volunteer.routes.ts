import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { VolunteerController } from '../controllers/VolunteerController';
import { UserRole } from '../constants';

const router = Router();

// Globally secure volunteer endpoints
router.use(requireAuth);

router.get('/', requireRole(UserRole.ADMIN), VolunteerController.getVolunteers);
router.get('/recommended', requireRole(UserRole.ADMIN), VolunteerController.getRecommended);

export default router;
