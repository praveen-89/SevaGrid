import { Request, Response, NextFunction } from 'express';
import { APIResponse } from '../utils/APIResponse';
import { AssignmentService } from '../services/AssignmentService';
import { VolunteerService } from '../services/VolunteerService';
import { Profile } from '../types';

export class AssignmentController {
  static async assign(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: caseId } = req.params;
      const { volunteerId, note } = req.body;
      const admin = req.user as Profile;

      const assignment = await AssignmentService.assignVolunteer(caseId, volunteerId, admin, note);
      return APIResponse.success(res, assignment, 'Dispatch assigned perfectly', 201);
    } catch (err) {
      next(err);
    }
  }
}

export class VolunteerController {
  static async getVolunteers(req: Request, res: Response, next: NextFunction) {
     try {
        const directory = await VolunteerService.getVolunteers();
        return APIResponse.success(res, directory);
     } catch (err) {
        next(err);
     }
  }

  static async getRecommended(req: Request, res: Response, next: NextFunction) {
     try {
       const caseId = req.query.caseId as string;
       if (!caseId) return APIResponse.error(res, 'Missing target case matrix identifier', null, 400);

       const matches = await VolunteerService.getRecommended(caseId);
       return APIResponse.success(res, matches);
     } catch (err) {
       next(err);
     }
  }
}
