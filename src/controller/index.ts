import { Request, Response } from 'express';

export * from './failure/notfound';

export async function rootHandler(req: Request, res: Response): Promise<Response>{
  return res.json({
    message: 'You\'ve reached API root endpoint. For more details read API Docs.'
  });
}