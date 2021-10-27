import { Request, Response } from 'express';
import { TokenBearer } from '../../utils/token';
import { Failure } from '../failure';
import { Content } from '../../entities/content';
import { Success } from '../success';
import * as fs from 'fs';
import { readEnv } from '../../services';
import { validate as validateUUID } from 'uuid';

export async function deleteHandler(req: Request, res: Response): Promise<Response> {
  const contentId = req.params.id;
  if(!contentId || !validateUUID(contentId)) return Failure.badRequest(res, 'Invalid token provided');
  try {
    const token = await TokenBearer(req);
    if (await Content.delete(token, contentId)) {
      fs.unlink(`${readEnv().savePath}/${contentId}.mp3`, () => {});
    } else return Failure.badRequest(res, 'Content with specified id does not exists');
    return Success.NoContent(res, {
      message: 'Content delete successfully.'
    });
  } catch (e) {
    return Failure.internalServerError(res, 'Unexpected server response');
  }
}