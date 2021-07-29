import { BookListEntry } from '../booklist/book';
import { Stats } from '../stats.service';

export interface Friend {
  name: string;
  bookList: BookListEntry[];
  stats: Stats;
}
