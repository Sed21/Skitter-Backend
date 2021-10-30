import { Request, Response } from 'express';
import { TokenBearer } from '../../utils/token';
import { Favorite } from '../../entities/favorite';
import { Success } from '../success';
import { Failure } from '../failure';

export async function viewFavoritesHandler(req: Request, res: Response): Promise<Response> {
  try {
    const token = await TokenBearer(req);
    const response = await Favorite.getMany(token);
    return Success.Ok(res, {
      found: response.length,
      favorites: response
    });
  } catch (e) {
    return Failure.notAuthorized(res);
  }
}