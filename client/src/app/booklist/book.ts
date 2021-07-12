const enum status {
  completed = 'Completed',
  dropped = 'Dropped',
  on_hold = 'On-hold',
  reading = 'Reading',
  plan_to_read = 'Plan to read',
}

export interface Book {
  title: String;
  author: String;
  pageCount: Number;
  coverImage: String;
  blurb?: String;
  categories: String[];
  datePublished: Date;
}

export interface BookListEntry {
  volumeId: String;
  book: Book;
  status: status;
  notes?: String;
  currentPageCount: Number;
  rating?: Number;
  review?: Number;
  startDate?: Date;
  endDate?: Date;
}
