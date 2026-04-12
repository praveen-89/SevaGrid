import { Request, Response, NextFunction } from 'express';
import { APIResponse } from '../utils/APIResponse';
import { UserRole } from '../constants';

/**
 * Locks down endpoints matching the authenticated user's Role string.
 * Note: Must be invoked downstream AFTER requireAuth
 */
export const requireRole = (roles: UserRole | UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return APIResponse.error(res, 'Unauthorized - Required Auth State Missing', null, 401);
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(req.user.role)) {
      return APIResponse.error(
         res, 
         `Forbidden - Feature requires one of roles: [${allowedRoles.join(', ')}]`, 
         null, 
         403
      );
    }

    next();
  };
};
