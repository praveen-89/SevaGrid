import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { CaseController } from '../controllers/CaseController';
import { validate, createCaseSchema } from '../validators/case.validator';
import { UserRole } from '../constants';

const router = Router();

router.use(requireAuth);

// Base Queries
router.get('/', CaseController.getCases);
router.get('/:id', CaseController.getCaseById);
router.get('/:id/history', CaseController.getCaseHistory);

// Field Staff
router.post('/', requireRole(UserRole.FIELD_STAFF), validate(createCaseSchema), CaseController.createCase);

// Volunteer Actions
router.post('/:id/accept', requireRole(UserRole.VOLUNTEER), CaseController.accept);
router.post('/:id/reject', requireRole(UserRole.VOLUNTEER), CaseController.reject);
router.post('/:id/start', requireRole(UserRole.VOLUNTEER), CaseController.start);
router.post('/:id/submit-proof', requireRole(UserRole.VOLUNTEER), CaseController.submitProof);

// Admin Actions
router.post('/:id/assign', requireRole(UserRole.ADMIN), CaseController.assign);
router.post('/:id/reassign', requireRole(UserRole.ADMIN), CaseController.reassign);
router.post('/:id/verify-proof', requireRole(UserRole.ADMIN), CaseController.verifyProof);
router.post('/:id/reject-proof', requireRole(UserRole.ADMIN), CaseController.rejectProof);
router.post('/:id/escalate', requireRole(UserRole.ADMIN), CaseController.escalate);
router.post('/:id/fail', requireRole(UserRole.ADMIN), CaseController.failCase);

export default router;
