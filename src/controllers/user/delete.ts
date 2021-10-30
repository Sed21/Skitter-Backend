import { Request, Response } from 'express';
import { TokenBearer } from '../../utils/token';
import { User } from '../../entities';
import { Failure } from '../failure';
import { Success } from '../success';

export async function deleteUserHandler(req: Request, res: Response): Promise<Response> {
  try {
    const token = await TokenBearer(req);
    const response = await User.delete(token);
    if(!response) return Failure.badRequest(res, 'User might not exists');
    return Success.NoContent(res);
  } catch(e) {
    return Failure.badRequest(res, 'Invalid data provided');
  }
}