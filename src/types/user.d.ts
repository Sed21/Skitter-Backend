import { String } from './std';
import { UUID } from './uuid';
import { User } from '../entity';

export type Username = String;
export type Password = String;
export type Token = String;
export type Id = UUID;

export type AvailableRoles = 'Creator' | 'Listener';
export type AllRoles = 'Admin' | AvailableRoles;

type UserAuthBase = {
  username: Username;
  password: Password; // base64 encoded string
};

export interface SignOutBody {
  token: Token
}
export interface SignInBody extends UserAuthBase {}
export interface SignUpBody extends UserAuthBase {
  role: AvailableRoles
}

export type SignUpResponse = {
  id: UUID;
  username: Username;
  role: AvailableRoles;
  token: Token;
  token_gen_date: Date;
  token_expr_date: Date;
}

export type UserDB = SignUpResponse & {
  password: Password
}

export type JWTPayload = {
  username: Username,
  role: AllRoles,
  token: Token,
  token_expr_date: Date;
}