import { Request, Response } from 'express';
import { TokenBearer } from '../../utils/token';
import { validate } from 'uuid';
import { Failure } from '../failure';
import { ReviewMark } from '../../types';
import { Review } from '../../entities/review';
import { Success } from '../success';
import { User } from '../../entities';

export async function addReviewHandler(req: Request, res: Response): Promise<Response> {
  const token = await TokenBearer(req);
  const contentId = req.params.id;
  const reviewMark: ReviewMark = req.body;
  if(!contentId || !validate(contentId)) return Failure.badRequest(res, 'Invalid content id provided');
  if(reviewMark.value <= 0.0 || reviewMark.value >= 5.0) return  Failure.badRequest(res, 'Invalid review mark value');

  try {
    const user: User | undefined = await User.getOne(undefined, undefined, token);
    if(!user) return Failure.badRequest(res, 'User doesn\'t exists.');
    const review: Review = new Review(contentId, reviewMark.value, user.id);
    if(await review.addReview()) return Success.Ok(res, { message: 'User review has been added' });
    return Failure.badRequest(res, 'User already review mentioned content.');
  } catch(e) {
    return Failure.internalServerError(res, 'Unexpected server behaviour');
  }
}