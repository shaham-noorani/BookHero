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
  pageCount: number;
  coverImage: string;
  blurb?: string;
  categories: string[];
  datePublished: Date;
}

export interface BookListEntry {
  volumeId: string;
  book?: Book;
  status: string;
  notes?: string;
  currentPageCount: number;
  rating?: number;
  review?: number;
  startDate?: Date;
  endDate?: Date;
}
