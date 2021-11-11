import { Request, Response } from 'express';

export async function checkTokenHandler(req: Request, res: Response): Promise<Response> {
  return res.json({
    valid: 'true',
    message: 'Token is valid'
  });
}