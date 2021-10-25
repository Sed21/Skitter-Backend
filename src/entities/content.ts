import { UUID, String, Number, QueryResultShort, Token, ExportedContent } from '../types';
import { SecureGen } from '../utils';
import { Database } from '../services';

export class Content {
  content_id: UUID;
  book_title: String;
  book_author: String;
  description: String;
  mime_type: String;
  upload_date: Date;
  review: Number;
  creator_id: UUID;

  constructor(mimetype: String, creatorId: UUID, bookTitle: String, bookAuthor: String, description: String) {
    this.content_id = SecureGen.uuid();
    this.book_author = bookAuthor;
    this.book_title = bookTitle;
    this.review = 0.0;
    this.upload_date = new Date();
    this.description = description;
    this.creator_id = creatorId;
    this.mime_type = mimetype;
  }
  
  public static async getMany(contentId?: UUID[] | UUID, creatorId?: UUID, bookTitle?: String, bookAuthor?: String): Promise<ExportedContent[]> {
    const filters = {
      contentId: contentId,
      creatorId: creatorId,
      bookTitle: bookTitle,
      bookAuthor: bookAuthor
    };

    let query = `SELECT content_id, book_title, book_author, review, description, upload_date, creator_id, username FROM "${Database.schemaName}".content INNER JOIN ${Database.schemaName}.users ON (creator_id = users.id) `;
    if(Object.values(filters).every(_ => !_)) {
      const response = await Database.query(query);
      return Content.toExportedObject(response);
    }
    return [];
  }


  public async save(): Promise<Boolean> {
    const query = `INSERT INTO "${Database.schemaName}".content VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING true;`;
    const result = await Database.query(query, [
      this.content_id,
      this.book_title,
      this.book_author,
      this.review,
      this.description,
      this.mime_type,
      this.upload_date,
      this.creator_id
    ]);
    return result.rowCount !== 0;
  }

  public static async delete(token: Token, contentId: UUID): Promise<Boolean> {
    const query = `DELETE FROM "${Database.schemaName}".content USING "${Database.schemaName}".users WHERE content_id = $1 AND token = $2 RETURNING true;`;
    const response = await Database.query(query, [contentId, token]);
    return response.rowCount !== 0;
  }

  public static toObject(queryResult: QueryResultShort): Content[] {
    return queryResult.rows.map(e => {
      const content: Content = new Content(
        e.mime_type,
        e.creatorId,
        e.book_title,
        e.book_author,
        e.description
      );
      content.content_id = e.contentId;
      content.upload_date = e.upload_date;
      content.review = e.review;
      return content;
    }) as Content[];
  }

  public static toExportedObject(queryResult: QueryResultShort): ExportedContent[] {
    return queryResult.rows.map(r => {
      return {
        content_id: r.content_id,
        creator_id: r.creator_id,
        creator_name: r.username,
        book_title: r.book_title,
        book_author: r.book_author,
        review: r.review,
        description: r.description,
        upload_date: r.upload_date
      };
    }) as ExportedContent[];
  }
}