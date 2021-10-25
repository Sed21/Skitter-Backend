import { Token } from '../types';
import { JWT } from '../services';
import { Request } from 'express';

export async function TokenBearer(req: Request): Promise<Token> {
  const token = req.header('X-SESSION-TOKEN') || '';
  return JWT.verify(token).token;
}