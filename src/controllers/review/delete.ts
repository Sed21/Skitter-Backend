import { Request, Response } from 'express';
import { TokenBearer } from '../../utils/token';
import { validate } from 'uuid';
import { Failure } from '../failure';
import { Review } from '../../entities/review';
import { Success } from '../success';

export async function deleteReviewHandler(req: Request, res: Response): Promise<Response> {
  const token = await TokenBearer(req);
  const contentId = req.params.id;
  if(!contentId || !validate(contentId)) return Failure.badRequest(res, 'Invalid content id provided');

  try {
    const response = await Review.deleteReview(contentId, token);
    console.log(response);
    if(response) return Success.NoContent(res);
    else return Failure.badRequest(res,'Invalid content id specified. Review might not exists');
  } catch(e) {
    console.log(e);
    return Failure.internalServerError(res, 'Unexpected server behaviour');
  }
}