import { Request, Response } from 'express';
import { SignInBody } from '../../types';
import { User } from '../../entity';
import { Failure } from '../failure';
import { compareHash } from '../../utils';
import { Success } from '../success';

export async function signInHandler(req: Request, res: Response): Promise<Response> {
  const body: SignInBody = req.body;
  if(!body.username || !body.password) return Failure.badRequest(res, 'Invalid data provided');

  try {
    const user: User | undefined = await User.getOne(body.username);
    if(user === undefined) await Promise.reject('User do not exist');
    else if(!compareHash(body.password, user.password)) await Promise.reject('User or password is wrong');
    else {
      await user.createSession();
      return Success.Ok(res, user.expose());
    }
    return Failure.internalServerError(res);
  } catch (e) {
    return Failure.badRequest(res, String(e));
  }
}