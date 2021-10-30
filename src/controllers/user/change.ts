import { Request, Response } from 'express';
import { UserChanges } from '../../types';
import { Failure } from '../failure';
import { User } from '../../entities';
import { TokenBearer } from '../../utils/token';
import { Success } from '../success';

export async function userChangeHandler(req: Request, res: Response): Promise<Response> {
  const changes: UserChanges = req.body;
  if(!changes.profile_description) return Failure.badRequest(res, 'Empty body provided');

  try {
    const userToken = await TokenBearer(req);
    const response = await User.changeDescription(userToken, changes.profile_description);
    if(!response) return Failure.badRequest(res, 'Invalid data provided');
    return Success.Created(res);
  } catch (e) {
    return Failure.notAuthorized(res);
  }
}