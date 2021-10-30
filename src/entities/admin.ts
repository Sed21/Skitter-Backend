import { Boolean, ExportedUser, UUID } from '../types';
import { Database } from '../services';
import { User } from './user';

export class Admin {
  static async viewUsers(): Promise<ExportedUser[]>{
    const query = `SELECT id, username, signup_date, profile_description, token_gen_date FROM "${Database.schemaName}".users;`;
    const response = await Database.query(query);
    return response.rows.map(_ => {
      return {
        id: _.id,
        username: _.username,
        role: _.role,
        profile_description: _.profile_description,
        signup_date: _.signup_date,
        last_signin: _.token_gen_date
      };
    }) as ExportedUser[];
  }

  static async deleteUser(user_id: UUID): Promise<Boolean> {
    return await User.delete('', user_id);
  }
}