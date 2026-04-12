import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { AssignmentController, VolunteerController } from '../controllers/OrchestrationController';
import { UserRole } from '../constants';

const router = Router();
router.use(requireAuth);

// Volunteer Read Routing
router.get('/volunteers', requireRole(UserRole.ADMIN), VolunteerController.getVolunteers);
router.get('/volunteers/recommended', requireRole(UserRole.ADMIN), VolunteerController.getRecommended);

// Operational Assignments (Attached directly via /api/cases/:id/assign structure commonly)
// We expose it here for clean scaling mapping inside `app.ts` as /api/dispatch
router.post(
  '/dispatch/:id/assign',
  requireRole(UserRole.ADMIN),
  AssignmentController.assign
);

export default router;
