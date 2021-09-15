import { Request, Response } from 'express';

export async function notFound(req: Request, res: Response): Promise<Response> {
  return res.status(404).json({
    message: 'Endpoint doesn\'t exists. Please, read API docs for more information.'
  });
}