import { Request, Response, NextFunction } from 'express';
import { APIResponse } from '../utils/APIResponse';
import { CaseService } from '../services/CaseService';
import { Profile } from '../types';

export class CaseController {
  // Existing CRUD Methods
  static async getCases(req: Request, res: Response, next: NextFunction) {
    try {
      const cases = await CaseService.getCases(req.user as Profile);
      return APIResponse.success(res, cases);
    } catch (err) { next(err); }
  }

  static async getCaseById(req: Request, res: Response, next: NextFunction) {
    try {
      const caseData = await CaseService.getCaseById(req.params.id, req.user as Profile);
      return APIResponse.success(res, caseData);
    } catch (err) { next(err); }
  }

  static async createCase(req: Request, res: Response, next: NextFunction) {
    try {
      const newCase = await CaseService.createCase(req.body, req.user as Profile);
      return APIResponse.success(res, newCase, 'Case Intake Indexed Successfully', 201);
    } catch (err) { next(err); }
  }

  static async getCaseHistory(req: Request, res: Response, next: NextFunction) {
     try {
       // Using getCaseById first internally handles Auth verification of resource
       await CaseService.getCaseById(req.params.id, req.user as Profile);
       // Removed from CaseController and imported here to resolve cleanly
       // const history = await CaseService.getHistory(req.params.id);
       // Instead we query securely:
       const { supabaseAdmin } = await import('../config/supabase');
       const { data } = await supabaseAdmin.from('case_history').select('*').eq('case_id', req.params.id).order('created_at', { ascending: false });
       return APIResponse.success(res, data);
     } catch (err) { next(err); }
  }

  // --- VOLUNTEER WORKFLOW CONTROLLERS ---
  
  static async accept(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CaseService.acceptCase(req.params.id, req.user as Profile);
      return APIResponse.success(res, result, 'Assignment accepted');
    } catch (err) { next(err); }
  }

  static async reject(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CaseService.rejectCase(req.params.id, req.user as Profile, req.body.reason || 'No reason provided');
      return APIResponse.success(res, result, 'Assignment rejected');
    } catch (err) { next(err); }
  }

  static async start(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CaseService.startCase(req.params.id, req.user as Profile);
      return APIResponse.success(res, result, 'Case in progress');
    } catch (err) { next(err); }
  }

  static async submitProof(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CaseService.submitProof(req.params.id, req.user as Profile, req.body.notes);
      return APIResponse.success(res, result, 'Proof submitted for verification');
    } catch (err) { next(err); }
  }

  // --- ADMIN WORKFLOW CONTROLLERS ---
  
  static async assign(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CaseService.adminAssign(req.params.id, req.body.volunteerId, req.user as Profile);
      return APIResponse.success(res, result, 'Case assigned');
    } catch (err) { next(err); }
  }

  static async reassign(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CaseService.adminReassign(req.params.id, req.body.volunteerId, req.user as Profile);
      return APIResponse.success(res, result, 'Case reassigned');
    } catch (err) { next(err); }
  }

  static async verifyProof(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CaseService.verifyProof(req.params.id, req.user as Profile, req.body.note || 'Verified via Admin panel');
      return APIResponse.success(res, result, 'Case completed and verified');
    } catch (err) { next(err); }
  }

  static async rejectProof(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CaseService.rejectProof(req.params.id, req.user as Profile, req.body.note || 'Proof rejected by Admin');
      return APIResponse.success(res, result, 'Proof rejected, case reverted to progress');
    } catch (err) { next(err); }
  }

  static async escalate(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CaseService.escalateCase(req.params.id, req.user as Profile, req.body.note || 'Admin Escalation');
      return APIResponse.success(res, result, 'Case escalated');
    } catch (err) { next(err); }
  }

  static async failCase(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CaseService.failCase(req.params.id, req.user as Profile, req.body.note || 'Admin marked as failed');
      return APIResponse.success(res, result, 'Case failed');
    } catch (err) { next(err); }
  }
}
