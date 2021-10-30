import { Database } from '../services';
import { Boolean, Number, Token, UUID } from '../types';
import { SecureGen } from '../utils';
import { validate } from 'uuid';

export class Review {
  review_id: UUID;
  review_mark: Number;
  review_date: Date;
  content_id: UUID;
  user_id: UUID;

  constructor(review_content_id: UUID, review_mark: Number, token: Token) {
    this.review_id = SecureGen.uuid();
    this.review_mark = review_mark;
    this.review_date = new Date();
    this.content_id = review_content_id;
    this.user_id = token;
  }

  public static async getBoolIfExists(content_id: UUID, user_id: UUID): Promise<Boolean> {
    if(!validate(content_id) && validate(user_id)) return Promise.reject('Provided data are not valid');

    const query = `SELECT 1 FROM "${Database.schemaName}".reviews JOIN "${Database.schemaName}".users ON user_id = id WHERE content_id=$1 AND user_id=$2;`;
    const response = await Database.query(query, [content_id, user_id]);

    return response.rowCount !== 0;
  }

  public async addReview(): Promise<Boolean>{
    if(await Review.getBoolIfExists(this.content_id, this.user_id)) return false;

    const query = `INSERT INTO "${Database.schemaName}".reviews VALUES ($1, $2, $3, $4, $5) RETURNING true`;
    const params = [this.review_id, this.review_mark, this.review_date, this.content_id, this.user_id];
    const response = await Database.query(query, params);
    const responseUpdateReview = await Review.computeReviewValue(this.content_id);

    return response.rowCount !== 0 && responseUpdateReview;
  }

  private static async computeReviewValue(content_id: UUID): Promise<Boolean> {
    const query = `SELECT review_mark FROM "${Database.schemaName}".reviews WHERE content_id = $1;`;
    const response = await Database.query(query, [content_id]);

    let computeMedian: Number = 0.0;
    if(response.rowCount > 0) {
      const reviewValues: Array<Number> = response.rows.map(e => e.review_mark);
      const reviewSum: Number = reviewValues.reduce((acc, t ) => t + acc);
      computeMedian = response.rowCount > 1 ? Number((reviewSum / response.rowCount).toFixed(2)) : (reviewSum > 0 ? reviewSum : 0);
    }

    const queryUpdate = `UPDATE "${Database.schemaName}".content SET review = $1 WHERE content_id = $2 RETURNING true`;
    const responseUpdate = await Database.query(queryUpdate, [computeMedian, content_id]);

    return responseUpdate.rowCount !== 0;
  }

  public static async deleteReview(content_id: UUID, token: Token): Promise<Boolean> {
    const query = `DELETE FROM "${Database.schemaName}".reviews USING "${Database.schemaName}".users
                        WHERE reviews.content_id = $1 AND (SELECT (reviews.user_id = (SELECT id FROM "${Database.schemaName}".users WHERE token = $2))
                                OR( SELECT (SELECT role FROM "${Database.schemaName}".users WHERE token = $2) = 'Admin'));`;
    const response = await Database.query(query, [content_id, token]);

    const responseRecomputeReview = await Review.computeReviewValue(content_id);
    return response.rowCount !== 0 && responseRecomputeReview;
  }
}