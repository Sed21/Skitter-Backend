import { Boolean, Token, UUID } from '../types';
import { SecureGen } from '../utils';
import { Database } from '../services';
import { User } from './user';
import { ExportedFavorites } from '../types/favorite';

export class Favorite {
  id: UUID;
  content_id: UUID;
  add_date: Date;

  constructor(content_id: UUID) {
    this.id = SecureGen.uuid();
    this.add_date = new Date();
    this.content_id = content_id;
  }

  public async save(user_token: Token): Promise<Boolean> {
    const user: User | undefined = await User.getOne(undefined, undefined, user_token);
    if(!user) return Promise.reject('User with specified token does not exists');

    const queryFindFavorite = `SELECT 1 FROM "${Database.schemaName}".favorites WHERE user_id=$1 AND content_id=$2;`;
    const responseFind = await Database.query(queryFindFavorite, [user.id, this.content_id]);
    if(responseFind.rowCount !== 0) return false;

    const query = `INSERT INTO "${Database.schemaName}".favorites VALUES ($1, $2, $3, $4);`;
    const response = await Database.query(query, [this.id, this.content_id, user.id, this.add_date]);
    return response.rowCount !== 0;
  }

  public static async getMany(user_token: Token): Promise<ExportedFavorites[]> {
    const foundUser: User | undefined = await User.getOne(undefined, undefined, user_token);
    if(!foundUser) return Promise.reject('User with specified token does not exists');

    const query = `SELECT * FROM "${Database.schemaName}".favorites JOIN "${Database.schemaName}".content ON content.content_id=favorites.content_id WHERE user_id = $1`;
    const response = await Database.query(query, [foundUser.id]);

    if(response.rowCount === 0) return [];
    return response.rows.map(e => {
      return {
        content_id: e.content_id,
        creator_id: e.creator_id,
        creator_name: e.creator_name,
        book_title: e.book_title,
        book_author: e.book_author,
        review: e.review,
        description: e.description,
        upload_date: e.upload_date,
        user_id: e.user_id
      };
    }) as ExportedFavorites[];
  }

  public static async delete(user_token: Token, content_id: UUID): Promise<Boolean> {
    const query = `DELETE FROM "${Database.schemaName}".favorites WHERE (SELECT (user_id = (SELECT id FROM "${Database.schemaName}".users WHERE token = $1))) AND content_id=$2 RETURNING true;`;
    const response = await Database.query(query, [user_token, content_id]);

    return response.rowCount !== 0;
  }
}