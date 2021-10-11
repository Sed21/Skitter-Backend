import { Request, Response } from 'express';
import { Failure } from '../failure';
import { User } from '../../entity';
import { Success } from '../success';
import { SignUpBody, SignUpResponse } from '../../types';
import { Validator } from '../../utils';
import { JWT } from './jwt';

export async function signUpHandler(req: Request, res: Response): Promise<Response> {
  const body: SignUpBody = req.body;
  if (
    !(Validator.username(body.username) &&
      Validator.password(body.password) &&
      !(body.role in ['Creator', 'Listener']))
  ) return Failure.badRequest(res, 'Provided information is not valid');

  const user: User = new User(body.username, body.password, body.role);

  try {
    const savedUser: User = await user.insert();
    const resp: SignUpResponse = {
      id: savedUser.id,
      username: savedUser.username,
      role: savedUser.role,
      registration_date: savedUser.signup_date,
      token: JWT.sign({
        username: savedUser.username,
        role: savedUser.role,
        token: savedUser.token
      }),
      token_gen_date: savedUser.token_gen_date,
      token_expr_date: savedUser.token_expr_date
    };
    return Success.Created(res, resp);
  } catch (e) {
    return Failure.badRequest(res, String(e));
  }
}
