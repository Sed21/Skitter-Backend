import { Request, Response } from 'express';
import { TokenBearer } from '../../utils/token';
import { Failure } from '../failure';
import { Content } from '../../entities/content';
import { DeleteInfo } from '../../types';
import { Success } from '../success';
import * as fs from 'fs';
import { readEnv } from '../../services';
import { validate as validateUUID } from 'uuid';

export async function deleteHandler(req: Request, res: Response): Promise<Response> {
  const token = TokenBearer(req);
  const contentId: DeleteInfo = req.body;
  if(!validateUUID(contentId.content_id)) return Failure.badRequest(res, 'Invalid token provided');
  try {
    if (await Content.delete(await token, contentId.content_id)) {
      fs.unlink(`${readEnv().savePath}/${contentId.content_id}.mp3`, () => {});
    } else return Failure.badRequest(res, 'User is not authorized to delete this content');
    return Success.NoContent(res, {
      message: 'Content delete successfully.'
    });
  } catch (e) {
    return Failure.internalServerError(res, 'Unexpected server response');
  }
}