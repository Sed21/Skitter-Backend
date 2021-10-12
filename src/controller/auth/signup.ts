import { Request, Response } from 'express';
import { Failure } from '../failure';
import { User } from '../../entity';
import { Success } from '../success';
import { SignUpBody } from '../../types';
import { Validator } from '../../utils';

export async function signUpHandler(req: Request, res: Response): Promise<Response> {
  const body: SignUpBody = req.body;
  if (
    !(Validator.username(body.username) &&
      Validator.password(body.password) &&
      !(body.role in ['Creator', 'Listener']))
  ) return Failure.badRequest(res, 'Provided information is not valid');

  const user: User = new User(body.username, body.password, body.role);
  try {
    const savedUser: User = await user.save();
    return Success.Created(res, savedUser.expose());
  } catch (e) {
    return Failure.badRequest(res, String(e));
  }
}
