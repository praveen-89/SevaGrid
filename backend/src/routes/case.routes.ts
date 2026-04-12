import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { CaseController } from '../controllers/CaseController';
import { validate, createCaseSchema, updateCaseStatusSchema } from '../validators/case.validator';
import { UserRole } from '../constants';

const router = Router();

// Universal auth guard against all boundaries
router.use(requireAuth);

router.get('/', CaseController.getCases);
router.get('/:id', CaseController.getCaseById);
router.get('/:id/history', CaseController.getCaseHistory);

// Specific Access Endpoints
router.post(
  '/', 
  requireRole(UserRole.FIELD_STAFF), 
  validate(createCaseSchema), 
  CaseController.createCase
);

// Updates are dual-wielded (Volunteers transitioning in_progress, Admins assigning/closing)
router.patch(
  '/:id/status', 
  requireRole([UserRole.ADMIN, UserRole.VOLUNTEER]), 
  validate(updateCaseStatusSchema), 
  CaseController.updateStatus
);

export default router;
