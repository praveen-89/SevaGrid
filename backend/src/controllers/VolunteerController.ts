import { Request, Response, NextFunction } from 'express';
import { APIResponse } from '../utils/APIResponse';
import { VolunteerService } from '../services/VolunteerService';

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
