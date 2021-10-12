import { Request, Response } from 'express';
import { SignOutBody } from '../../types';
import { Failure } from '../failure';
import { User } from '../../entity';
import { Success } from '../success';
import { JWT } from './jwt';

export async function signOutHandler(req: Request, res: Response): Promise<Response> {
  const body: SignOutBody = req.body;
  if(!body.token) return Failure.badRequest(res, 'Invalid token provided');

  try {
    const token = JWT.verify(body.token);
    await User.removeSession(token.token);
    return Success.Ok(res, {
      message: 'User signed out successfully.'
    });
  } catch (e) {
    return Failure.badRequest(res, String(e));
  }
}
