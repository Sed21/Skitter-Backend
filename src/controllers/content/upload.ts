import { Request, Response } from 'express';
import { Failure } from '../failure';
import { FileArray, UploadedFile } from 'express-fileupload';
import { Content } from '../../entities/content';
import { readEnv } from '../../services';
import { TokenBearer } from '../../utils/token';
import { User } from '../../entities';
import { ContentInfo } from '../../types';
import { Success } from '../success';
import * as path from 'path';

export async function uploadHandler(req: Request, res: Response): Promise<Response> {
  if(!req.files || Object.keys(req.files).length === 0) {
    return Failure.badRequest(res, 'No files uploaded.');
  }

  const files: FileArray = req.files;
  if(Object.keys(files).length > 1 || !(Object.values(files)).every(_ => ((_ as UploadedFile).mimetype === 'audio/mpeg') && (_ as UploadedFile).name.includes('.mp3'))) {
    return Failure.badRequest(res, 'Only one file at the time can be uploaded');
  }

  try {
    const contentInfo: ContentInfo = req.body;

    if(!(contentInfo.book_author &&
         contentInfo.book_title &&
         contentInfo.description)) return Failure.badRequest(res, 'Recording details are mandatory');
    const user = await User.getOne(undefined,undefined, await TokenBearer(req));
    if(user){
      const content: Promise<Content>[] = await Object.values(files).map(async f => {
        const file = f as UploadedFile;
        const entity = new Content(
          file.mimetype,
          user.id,
          contentInfo.book_title,
          contentInfo.book_author,
          contentInfo.description
        );
        const recordingPath = `${readEnv().savePath}${entity.content_id}${path.extname(file.name)}`;
        await file.mv(recordingPath);
        return entity;
      });

      await content.map(async (_) => {
        await (await _).save();
      });
      return Success.Created(res, {
        message: 'Recording has been added successfully.'
      });
    } else return Failure.notAuthorized(res);
  } catch (e) {
    return Failure.internalServerError(res, 'Server couldn\'t handle file upload');
  }
}