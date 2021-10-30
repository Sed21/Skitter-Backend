import { Request, Response } from 'express';
import { UUID } from '../../types';
import { validate } from 'uuid';
import { Failure } from '../failure';
import { Favorite } from '../../entities/favorite';
import { TokenBearer } from '../../utils/token';
import { Success } from '../success';

export async function deleteFavoriteHandler(req: Request, res: Response): Promise<Response> {
  const content_id: UUID | undefined = req.params.id;
  if(!content_id || (content_id && !validate(content_id))) return Failure.badRequest(res, 'Invalid content id');

  try {
    const token = await TokenBearer(req);
    const response = await Favorite.delete(token, content_id);

    if(response) return Success.NoContent(res);
    return Failure.badRequest(res, 'User doesn\'t have content in favorites');
  } catch (e) {
    return Failure.internalServerError(res, 'Unexpected server behaviour');
  }
}