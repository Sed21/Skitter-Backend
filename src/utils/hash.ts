import { String, Number, Password, Boolean } from '../types';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';

export function hashPassword(input: Password, rounds: Number = 10): String {
  const salt: String = genSaltSync(rounds);
  return hashSync(input, salt);
}

export function compareHash(data: String, encrypted: String): Boolean {
  return compareSync(data, encrypted);
}