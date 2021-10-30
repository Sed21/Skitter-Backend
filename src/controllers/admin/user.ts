import { Request, Response } from 'express';
import { Failure } from '../failure';
import { Admin } from '../../entities/admin';
import { validate } from 'uuid';
import { Success } from '../success';

export async function viewUserAdminHandler(req: Request, res: Response): Promise<Response> {
  try {
    const response = await Admin.viewUsers();
    return Success.Ok(res, {
      found: response.length,
      users: response
    });
  } catch (e) {
    return Failure.internalServerError(res);
  }
}


export async function deleteUserAdminHandler(req: Request, res: Response): Promise<Response> {
  const userId = req.params.id;
  if(!userId || (userId && !validate(userId))) return Failure.badRequest(res, 'Invalid user id');

  try {
    const response = await Admin.deleteUser(userId);
    if(response) return Success.NoContent(res);
    else return Failure.internalServerError(res, 'Couldn\'t delete user data');
  } catch (e) {
    return Failure.badRequest(res);
  }
}