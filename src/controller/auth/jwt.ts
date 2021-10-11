import { Username, Token, AvailableRoles, String } from '../../types';
import { readEnv } from '../../services';
import * as jwt from 'jsonwebtoken';

export class JWT {
  static sign(credentials: {
    username: Username,
    role: AvailableRoles,
    token: Token
  }): Token {
    const secret: String = readEnv().jwtSecret;
    return jwt.sign(credentials, secret);
  }
}
