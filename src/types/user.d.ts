import { String } from './std';
import { UUID } from './uuid';

export type Username = String;
export type Password = String;
export type Token = Array[256] | String;
export type Id = UUID;

export type AvailableRoles = 'Creator' | 'Listener';
export type AllRoles = 'Admin' | AvailableRoles;

type UserAuthBase = {
  username: Username;
  password: Password; // base64 encoded string
};

export interface SignInBody extends UserAuthBase {}
export interface SignUpBody extends UserAuthBase {
  role: AvailableRoles
}

export type SignUpResponse = {
  id: UUID;
  username: Username;
  registration_date: Date;
  role: AvailableRoles;
  token: Token;
  token_gen_date: Date;
  token_expr_date: Date;
}

export type UserDB = SignUpResponse & {
  password: Password
}