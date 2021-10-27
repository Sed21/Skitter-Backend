import { Request, Response } from 'express';
import { ViewOptions } from '../../types';
import { Failure } from '../failure';
import { Content } from '../../entities/content';
import { validate as validateUUID } from 'uuid';
import { Success } from '../success';

export async function viewHandler(req: Request, res: Response): Promise<Response> {
  const genericFilter: ViewOptions = {
    book_author: '',
    book_title: '',
    creator_id: '',
    limit: 0
  };

  const filters: ViewOptions = req.query as unknown as ViewOptions;
  const validateFilters = Object.keys(filters).filter(_ => Object.keys(genericFilter).indexOf(_) !== -1);

  if(Object.keys(filters).toString() !== validateFilters.toString())
    return Failure.badRequest(res, 'Invalid filters provided');

  if(filters.creator_id && !validateUUID(filters.creator_id)) return Failure.badRequest(res, 'Invalid creator id provided');
  if(filters.limit && (filters.limit <= 0 || filters.limit > 1000)) return Failure.badRequest(res, 'Invalid limit values provided');

  try {
    const content = await Content.getMany(filters.creator_id, filters.book_title, filters.book_author);
    return Success.Ok(res, {
      found: filters.limit ? filters.limit : content.length,
      content: filters.limit ? content.slice(0, filters.limit) : content
    });
  } catch (e) {
    return Failure.internalServerError(res, 'Unexpected server behaviour');
  }
}