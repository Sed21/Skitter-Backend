import {
  AvailableRoles,
  Password,
  Username,
  UUID,
  Token,
  Number,
  AllRoles,
  UserDB,
  Boolean,
  QueryResultShort, SignUpResponse
} from '../types';
import { hashPassword, SecureGen } from '../utils';
import { Database, tokenDuration, JWT } from '../services';

export class User {
  id: UUID;
  username: Username;
  password: Password;
  signup_date: Date;
  role: AvailableRoles;
  token: Token;
  token_gen_date: Date;
  token_expr_date: Date;
  private valid: Boolean;

  constructor(username?: Username, password?: Password, role?: AvailableRoles) {
    if(username && password && role) {
      this.valid = true;
      const currentDate: Number = Date.now();
      this.id = SecureGen.uuid();
      this.username = username;
      this.password = hashPassword(password);
      this.role = role;
      this.signup_date = new Date(currentDate);
      this.token_gen_date = new Date(currentDate);
      this.token_expr_date = new Date(currentDate + tokenDuration);
      this.token = SecureGen.token();
    } else {
      this.valid = false;
      const defaultDate = new Date(Date.now());
      this.id = '';
      this.username = '';
      this.password = '';
      this.role = 'Listener';
      this.signup_date = defaultDate;
      this.token_gen_date = defaultDate;
      this.token_expr_date = defaultDate;
      this.token = '';
    }
  }

  /**
   * Save user in database if it's unique, otherwise promise fail.
   */
  public static async getMany(username?: Username, id?: UUID, token?: Token, role ?:AllRoles): Promise<User[] | undefined> {
    const filters = {
      id: id,
      username: username,
      token: token,
      role: role
    };
    if(Object.values(filters).every(_ => !_)) return Promise.reject('No filters selected');

    let query = `SELECT * FROM "${Database.schemaName}".users `;
    let args = Array();
    let nextArg: Number = 1;

    if(filters.id) {
      query = `${query} WHERE id=$${nextArg++} `;
      args.push(filters.id);
    }
    if(filters.username) {
      query = `${query} ${filters.id ? ` AND username=$${nextArg++} ` : ` WHERE username=$1 `}`;
      args.push(filters.username);
    }
    if(filters.token) {
      query = `${query} ${(filters.id || filters.username) ? ` AND token=$${nextArg++} ` : ` WHERE token=$1 `}`;
      args.push(filters.token);
    }
    if(filters.role) {
      query = `${query} ${(filters.id || filters.username || filters.role) ? ` AND role=$${nextArg} ` : ` WHERE role=$1 `}`;
      args.push(filters.role);
    }
    query = ` ${query} ;`;
    const found = await Database.query(query, args);
    if(found.rowCount === 0) return undefined;

    return User.toObject(found);
  }

  public static async getOne(username?: Username, id?: UUID, token?: Token, role ?:AllRoles): Promise<User | undefined> {
    const foundData = await this.getMany(username, id, token, role);
    return foundData ? foundData[0] : undefined;
  }

  public async save(): Promise<User> {
    const checkUsername = await User.getOne(this.username);
    if(checkUsername) return Promise.reject('User already exists');

    if(!this.valid) return Promise.reject('User is not valid.');
    const query = `INSERT INTO "${Database.schemaName}".users VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`;
    const result = await Database.query(query, [
      this.id,
      this.username,
      this.password,
      this.signup_date,
      this.role,
      this.token,
      this.token_gen_date,
      this.token_expr_date
    ]);
    if(result.rowCount === 0) return Promise.reject('Couldn\'t save user in database');
    return User.toObject(result)[0] || Promise.reject('Something went wrong');
  }

  public async createSession(): Promise<void> {
    if(!this.valid) return Promise.reject('Valid user expected');
    this.token = SecureGen.token();
    this.token_gen_date = new Date(Date.now());
    this.token_expr_date= new Date(Date.now() + tokenDuration);

    const query = `UPDATE "${Database.schemaName}".users SET token=$2, token_gen_date=$3, token_expr_date=$4 WHERE id=$1 RETURNING true;`;
    const result = await Database.query(query, [this.id, this.token, this.token_gen_date, this.token_expr_date]);
    if(result.rowCount === 0) return Promise.reject('Couldn\'t save token in database');
  }

  public static async removeSession(token: Token): Promise<void> {
    const query = `UPDATE "${Database.schemaName}".users SET token=$2, token_gen_date=$3, token_expr_date=$4 WHERE token=$1 RETURNING true;`;
    const result = await Database.query(query, [token, '*' , 'NOW()', 'NOW()']);
    if(result.rowCount === 0) return Promise.reject('Token does not exist');
  }

  public expose(): SignUpResponse {
    return {
      id: this.id,
      username: this.username,
      role: this.role,
      token: JWT.sign({
        username: this.username,
        role: this.role,
        token: this.token,
        token_expr_date: this.token_expr_date
      }),
      token_gen_date: this.token_gen_date,
      token_expr_date: this.token_expr_date
    };
  }

  public static toObject(queryResult: QueryResultShort): User[] {
    return queryResult.rows.map(e => {
      const userDB: UserDB = e as UserDB;
      const user: User = new User();
      user.valid = true;
      user.id = userDB.id;
      user.username = userDB.username;
      user.password = userDB.password;
      user.role = userDB.role;
      user.token_gen_date = userDB.token_gen_date;
      user.token_expr_date = userDB.token_expr_date;
      user.token = userDB.token;
      return user;
    }) as User[];
  }
}

