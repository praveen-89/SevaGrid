import { Response } from 'express';

export class APIResponse {
  static success(res: Response, data: any, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res: Response, message: string, errors: any = null, statusCode = 400) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }
}
