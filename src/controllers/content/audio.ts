import { Request, Response } from 'express';
import { validate as validateUUID } from 'uuid';
import { Failure } from '../failure';
import { Void } from '../../types';
import { readEnv } from '../../services';

export async function audioHandler(req: Request, res: Response): Promise<Response | Void> {
  const contentId = req.params.id;
  if(!contentId || !validateUUID(contentId)) return Failure.badRequest(res, 'Invalid content id');
  return res.sendFile(`${readEnv().savePath}/${contentId}.mp3`, (e) => { if(e) {
    res = Failure.badRequest(res ,'File not found');
    res.end();
  }});
}