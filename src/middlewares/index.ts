import { Request, Response } from 'express';
import { AllRoles, Next, Void } from '../types';
import { JWT } from '../services';
import { Failure } from '../controllers';

export function requireRole(...roles: AllRoles[]) {
  return (req: Request, res: Response, next: Next): Response | Void => {
    const token = String(req.header('X-SESSION-TOKEN'));
    try {
      const payload = JWT.verify(token);
      if(!roles.find(_ => _ === payload.role)) {
        return Failure.notAuthorized(res);
      }
      next();
    } catch (e) {
      return Failure.badRequest(res, 'Invalid token provided');
    }
  };
}