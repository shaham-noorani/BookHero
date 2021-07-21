export const StatusMapToCamelCase = new Map<string, string>([
  ['Completed', 'completed'],
  ['Dropped', 'dropped'],
  ['On-hold', 'onHold'],
  ['Reading', 'reading'],
  ['Plan to read', 'planToRead'],
]);

export const Ratings = [
  { value: 10, text: '10 - masterpiece' },
  { value: 9, text: '9 - really good' },
  { value: 8, text: '8 - great' },
  { value: 7, text: '7 - good' },
  { value: 6, text: '6 - okay' },
  { value: 5, text: '5 - not great' },
  { value: 4, text: '4 - bad' },
  { value: 3, text: '3 - really bad' },
  { value: 2, text: '2 - horrible' },
  { value: 1, text: '1 - abysmal' },
];

export const statusOrder: Map<string, number> = new Map([
  ['Completed', 1],
  ['Dropped', 2],
  ['On-hold', 3],
  ['Reading', 4],
  ['Plan to read', 5],
]);

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
