import { Request, Response } from 'express';
import { ViewOptions, String } from '../../types';
import { Failure } from '../failure';
import { Content } from '../../entities/content';
import { validate as validateUUID } from 'uuid';
import { Success } from '../success';

export async function viewHandler(req: Request, res: Response): Promise<Response> {
  const genericFilter: ViewOptions = {
    book_author: '',
    book_title: '',
    ids: [],
    creator_id: '',
    limit: 0
  };

  const filters: ViewOptions = req.query as unknown as ViewOptions;
  const validateFilters = Object.keys(filters).filter(_ => Object.keys(genericFilter).indexOf(_) !== -1);

  if(Object.keys(filters).toString() !== validateFilters.toString())
    return Failure.badRequest(res, 'Invalid filters provided');

  if(filters.creator_id && !validateUUID(filters.creator_id)) return Failure.badRequest(res, 'Invalid creator id provided');
  if(filters.ids) {
    if(filters.ids.length !== 0 || !filters.ids.every(_ => validateUUID(_)))
      return Failure.badRequest(res, 'Invalid content ids provided');
  }
  if(filters.limit && (filters.limit <= 0 || filters.limit > 1000)) return Failure.badRequest(res, 'Invalid limit values provided');

  try {
    const content = await Content.getMany();
    return Success.Ok(res, {
      found: content.length,
      content: content
    });
  } catch (e) {
    return Failure.internalServerError(res, 'Unexpected server behaviour');
  }
}