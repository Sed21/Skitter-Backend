import { Boolean, Username, Password } from '../types';

export class Validator {
  static username(input: Username): Boolean {
    const pattern = /^[a-zA-Z0-9]+([a-zA-Z0-9](_- )[a-zA-Z0-9])*[a-zA-Z0-9]+$/;
    return pattern.test(input) && input.length <= 32;
  }

  static password(input: Password): Boolean {
    const pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&_*-]).{8,32}$/;
    return pattern.test(input) && input.length <= 32;
  }
}