import { Request, Response } from 'express';
import { UUID } from '../../types';
import { validate } from 'uuid';
import { Failure } from '../failure';
import { Favorite } from '../../entities/favorite';
import { TokenBearer } from '../../utils/token';
import { Success } from '../success';

export async function addFavoritesHandler(req: Request, res: Response): Promise<Response> {
  const content_id: UUID | undefined = req.params.id;
  if(!content_id || (content_id && !validate(content_id))) return Failure.badRequest(res, 'Invalid content id');

  try {
    const token = await TokenBearer(req);
    const favorite: Favorite = new Favorite(content_id);
    if(!(await favorite.save(token))) return Failure.badRequest(res, 'Couldn\'t save user\'s favorite. User might already have content in favorites');
    return Success.Ok(res, { message: 'User favorite saved successfully.' });
  } catch (e) {
    return Failure.notAuthorized(res);
  }
}