import { Token, String, JWTPayload } from '../types';
import { readEnv } from './env';
import * as jwt from 'jsonwebtoken';

export class JWT {
  static sign(payload: JWTPayload): Token {
    const secret: String = readEnv().jwtSecret;
    return jwt.sign(payload, secret);
  }

  static verify(token: Token): JWTPayload {
    const secret: String = readEnv().jwtSecret;
    const decodedToken = jwt.verify(token, secret, { complete: false }) as JWTPayload;
    return {
      username: decodedToken.username,
      role: decodedToken.role,
      token: decodedToken.token,
      token_expr_date: decodedToken.token_expr_date
    };
  }
}
