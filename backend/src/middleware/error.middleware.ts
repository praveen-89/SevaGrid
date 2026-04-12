import { Request, Response, NextFunction } from 'express';
import { APIResponse } from '../utils/APIResponse';
import { ZodError } from 'zod';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('[Error Trace]:', err);

  // Safely translate Zod validation errors without leaking server code 
  if (err instanceof ZodError) {
    return APIResponse.error(res, 'Validation failed', err.errors, 400);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return APIResponse.error(res, message, null, statusCode);
}
