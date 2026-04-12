import { Request, Response, NextFunction } from 'express';
import { APIResponse } from '../utils/APIResponse';
import { CaseService } from '../services/CaseService';
import { Profile } from '../types';

export class CaseController {
  static async getCases(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as Profile;
      const cases = await CaseService.getCases(user);
      return APIResponse.success(res, cases);
    } catch (err) {
      next(err);
    }
  }

  static async getCaseById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = req.user as Profile;
      const caseData = await CaseService.getCaseById(id, user);
      return APIResponse.success(res, caseData);
    } catch (err) {
      next(err);
    }
  }

  static async createCase(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as Profile;
      const payload = req.body;
      const newCase = await CaseService.createCase(payload, user);
      return APIResponse.success(res, newCase, 'Case Intake Indexed Successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, note } = req.body;
      const user = req.user as Profile;
      
      const updatedCase = await CaseService.updateStatus(id, status, user, note);
      return APIResponse.success(res, updatedCase, `Status modified to ${status}`);
    } catch (err) {
      next(err);
    }
  }

  static async getCaseHistory(req: Request, res: Response, next: NextFunction) {
     try {
       const { id } = req.params;
       const history = await CaseService.getHistory(id);
       return APIResponse.success(res, history);
     } catch (err) {
       next(err);
     }
  }
}
