import { Request, Response } from 'express';

export * from './auth/signup';
export * from './auth/signin';
export * from './auth/signout';

export * from './content/view';
export * from './content/upload';
export * from './content/delete';
export * from './content/audio';

export * from './success';
export * from './failure';

export * from './review/add';
export * from './review/delete';

export async function rootHandler(req: Request, res: Response): Promise<Response> {
  return res.json({
    message:
      'You\'ve reached API root endpoint. For more details read API Docs.'
  });
}