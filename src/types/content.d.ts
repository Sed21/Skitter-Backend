import { String, Number } from './std';
import { UUID } from './uuid';

export type ContentInfo = {
  book_title: String,
  book_author: String,
  description: String,
  file_bytes: String
}

export type ViewOptions = {
  book_author: String,
  book_title: String,
  creator_id: UUID,
  content_id: UUID,
  limit: Number
}

export type ExportedContent = {
  content_id: UUID,
  creator_id: UUID,
  creator_name: String,
  book_title: String,
  book_author: String,
  review: Number,
  description: String,
  upload_date: Date,
}