export const enum status {
  completed = 'Completed',
  dropped = 'Dropped',
  on_hold = 'On-hold',
  reading = 'Reading',
  plan_to_read = 'Plan to read',
}

export interface Book {
  title: string;
  author: string;
  pageCount: Number;
  coverImage: string;
  blurb?: string;
  categories: string[];
  datePublished: Date;
}

export interface BookListEntry {
  volumeId: string;
  book: Book;
  status: string;
  notes?: string;
  currentPageCount: Number;
  rating?: Number;
  review?: Number;
  startDate?: Date;
  endDate?: Date;
}
