import { ExportedContent } from './content';
import { UUID } from './uuid';

export type ExportedFavorites = ExportedContent & {
  user_id: UUID,
}