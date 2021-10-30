import { Request, Response } from 'express';
import { validate } from 'uuid';
import { Failure } from '../failure';
import { User } from '../../entities';
import { Success } from '../success';

export async function viewUserHandler(req: Request, res: Response): Promise<Response> {
  const userID = req.params.id;
  if(!userID || (userID && !validate(userID))) return Failure.badRequest(res, 'Invalid user id');

  try {
    const user = await User.view(userID);
    return Success.Ok(res, user);
  } catch(e) {
    return Failure.badRequest(res, 'User not found');
  }
}