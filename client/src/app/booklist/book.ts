const enum status {
  completed = 'completed',
  dropped = 'dropped',
  on_hold = 'on-hold',
  reading = 'reading',
  plan_to_read = 'plan to read',
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
