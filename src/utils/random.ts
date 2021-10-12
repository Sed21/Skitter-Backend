import * as crypto from 'crypto';
import { Number, String, UUID, Token } from '../types';
import { v4 } from 'uuid';

export class SecureGen {
  static string (n: Number = 10): String {
    const m = (n <= 0) ? 10 : n;
    return crypto.randomBytes(m).toString('base64');
  }

  static uuid (): UUID {
    return v4() as UUID;
  }

  static token (): Token {
    return SecureGen.string(128);
  }
}